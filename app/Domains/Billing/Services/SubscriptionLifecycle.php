<?php

namespace App\Domains\Billing\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Domain\Events\SubscriptionExpired;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionNotice;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\SubscriptionNotice;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SubscriptionLifecycle
{
    public function __construct(private SubscriptionEntitlements $rights) {}

    public function recordNotice(Subscription $sub, string $kind, string $period, array $context = []): SubscriptionNotice
    {
        return SubscriptionNotice::firstOrCreate([
            'subscription_id' => $sub->id, 'kind' => $kind, 'period_key' => $period,
        ], ['context' => $context]);
    }

    public function hide(int $userId, string $reason): int
    {
        $count = 0;
        $this->rights->published($userId)->chunkById(100, function ($ads) use ($reason, &$count) {
            foreach ($ads as $ad) {
                $ad->forceFill(['is_published' => false, 'hidden_reason' => $reason, 'subscription_hidden_at' => now()])->save();
                $count++;
            }
        });

        return $count;
    }

    public function reconcile(Subscription $sub): array
    {
        $limit = $sub->limits()->listingLimit;
        $kept = 0;
        // Stable choice: most recently first-published, then highest ID.
        $this->rights->published($sub->user_id)->orderByDesc('first_published_at')->orderByDesc('id')
            ->cursor()->each(function (Ad $ad) use ($limit, &$kept) {
                if ($kept++ >= $limit) {
                    $ad->forceFill(['is_published' => false, 'hidden_reason' => 'plan_limit', 'subscription_hidden_at' => now()])->save();
                }
            });
        $available = max(0, $limit - $this->rights->published($sub->user_id)->count());
        $restored = 0;
        // Only automatic expiration/quota hides are eligible, never manual/admin/cancelled.
        Ad::where('user_id', $sub->user_id)->where('status', 'published')->where('is_approved', true)
            ->where('is_published', false)->whereIn('hidden_reason', ['subscription_expired', 'plan_limit'])
            ->orderByDesc('first_published_at')->orderByDesc('id')->cursor()->chunk(100)
            ->each(function ($batch) use (&$available, &$restored) {
                $ads = new Collection($batch->all());
                $ads->load('details');
                foreach ($ads as $ad) {
                    if ($available <= 0) {
                        return false;
                    }
                    try {
                        $this->rights->assertListingReady($ad);
                    } catch (ValidationException) {
                        continue;
                    }
                    $ad->forceFill(['is_published' => true, 'hidden_reason' => null, 'subscription_hidden_at' => null])->save();
                    $available--;
                    $restored++;
                }
            });

        return ['restored' => $restored, 'hidden' => Ad::where('user_id', $sub->user_id)
            ->whereIn('hidden_reason', ['subscription_expired', 'plan_limit'])->count()];
    }

    public function expire(Subscription $subscription): bool
    {
        return DB::transaction(function () use ($subscription) {
            User::whereKey($subscription->user_id)->lockForUpdate()->firstOrFail();
            $sub = Subscription::whereKey($subscription->id)->lockForUpdate()->firstOrFail();
            if ($sub->status !== 'active' || ! $sub->expires_at || $sub->expires_at->gt(now())) {
                return false;
            }
            $sub->update(['status' => 'expired']);
            $hidden = $this->rights->current($sub->user_id) ? 0 : $this->hide($sub->user_id, 'subscription_expired');
            $this->recordNotice($sub, 'expired', $sub->expires_at->toIso8601String(), ['hidden' => $hidden]);
            DB::afterCommit(fn () => event(new SubscriptionExpired($sub->user_id, $sub->plan_id, $sub->id)));
            app(AuditLogger::class)->record('subscription.expired', $sub, 'Abonnement expiré ; biens conservés.',
                ['status' => 'active'], ['status' => 'expired', 'hidden' => $hidden]);

            return true;
        }, 3);
    }

    public function process(): int
    {
        $expired = 0;
        // Repair legacy duplicates under the same lock used by payment activation.
        User::whereHas('subscriptions', fn ($q) => $q->where('status', 'active'), '>', 1)->chunkById(100, function ($users) {
            foreach ($users as $user) {
                DB::transaction(function () use ($user) {
                    User::whereKey($user->id)->lockForUpdate()->firstOrFail();
                    $keep = $this->rights->current($user->id);
                    if (! $keep) {
                        return;
                    }
                    Subscription::where('user_id', $user->id)->where('status', 'active')->whereKeyNot($keep->id)
                        ->get()->each(function ($duplicate) {
                            $duplicate->update(['status' => 'cancelled', 'failure_reason' => 'Duplicate active subscription superseded by the longest valid entitlement.']);
                            app(AuditLogger::class)->record('subscription.duplicate_reconciled', $duplicate, 'Doublon actif corrigé sans supprimer le paiement.', ['status' => 'active'], ['status' => 'cancelled'], 'warning');
                        });
                }, 3);
            }
        });
        Subscription::where('status', 'active')->where('expires_at', '<=', now())
            ->chunkById(100, function ($subs) use (&$expired) {
                foreach ($subs as $sub) {
                    $expired += (int) $this->expire($sub);
                }
            });
        Subscription::usable()->where('expires_at', '<=', now()->addDays(7))
            ->chunkById(100, function ($subs) {
                foreach ($subs as $sub) {
                    $this->recordNotice($sub, 'expiring', $sub->expires_at->toIso8601String());
                }
            });
        Subscription::where('status', 'expired')->where('expires_at', '<=', now()->subWeek())
            ->whereHas('user', fn ($q) => $q->whereNull('anonymized_at')->where('notifications_enabled', true))
            ->chunkById(100, function ($subs) {
                foreach ($subs as $sub) {
                    if ($this->rights->current($sub->user_id)
                        || ! Ad::where('user_id', $sub->user_id)->where('hidden_reason', 'subscription_expired')->exists()
                        || Subscription::where('user_id', $sub->user_id)->where('status', 'expired')->where('expires_at', '>', $sub->expires_at)->exists()) {
                        continue;
                    }
                    // One catch-up for the current week, never a burst of missed reminders.
                    $week = (int) floor($sub->expires_at->diffInDays(now()) / 7);
                    $this->recordNotice($sub, 'weekly', $sub->expires_at->toIso8601String().':'.$week);
                }
            });
        // Durable outbox: also retries notices left pending by an interrupted scheduler.
        SubscriptionNotice::whereNull('sent_at')->whereNull('skipped_at')->chunkById(100, function ($notices) {
            foreach ($notices as $notice) {
                SendSubscriptionNotice::dispatch($notice->id)->afterCommit();
            }
        });

        return $expired;
    }

    public function cancel(Subscription $sub, bool $immediate, string $reason): void
    {
        DB::transaction(function () use ($sub, $immediate, $reason) {
            User::whereKey($sub->user_id)->lockForUpdate()->firstOrFail();
            $sub = Subscription::whereKey($sub->id)->lockForUpdate()->firstOrFail();
            $before = $sub->only(['status', 'cancelled_at', 'expires_at']);
            $sub->update(['cancelled_at' => now(), 'failure_reason' => $reason,
                'status' => $immediate ? 'cancelled' : $sub->status]);
            if ($immediate && ! $this->rights->current($sub->user_id)) {
                $this->hide($sub->user_id, 'subscription_cancelled');
            }
            app(AuditLogger::class)->record('subscription.cancelled', $sub, $reason, $before, $sub->only(['status', 'cancelled_at', 'expires_at']), 'warning');
        }, 3);
    }
}

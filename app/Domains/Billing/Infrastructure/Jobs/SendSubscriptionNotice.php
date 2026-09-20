<?php

namespace App\Domains\Billing\Infrastructure\Jobs;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionLifecycleMail;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\SubscriptionNotice;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendSubscriptionNotice implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 45;

    public int $uniqueFor = 300;

    public function __construct(public int $noticeId) {}

    public function uniqueId(): string
    {
        return (string) $this->noticeId;
    }

    public function backoff(): array
    {
        return [30, 120, 300];
    }

    public function handle(SubscriptionEntitlements $rights): void
    {
        try {
            $candidate = SubscriptionNotice::with('subscription')->find($this->noticeId);
            DB::transaction(function () use ($rights, $candidate) {
                if ($candidate?->subscription) {
                    User::whereKey($candidate->subscription->user_id)->lockForUpdate()->first();
                }
                $notice = SubscriptionNotice::with('subscription.user')->lockForUpdate()->find($this->noticeId);
                if (! $notice || $notice->sent_at || $notice->skipped_at) {
                    return;
                }
                $sub = $notice->subscription;
                $user = $sub?->user;
                $skip = ! $sub || $sub->trashed() || ! $user || $user->anonymized_at || ! $user->email;
                if (! $skip && in_array($notice->kind, ['weekly', 'expired'])) {
                    $skip = $sub->status !== 'expired' || $rights->current($sub->user_id) !== null;
                }
                if (! $skip && $notice->kind === 'weekly') {
                    $week = (int) floor($sub->expires_at->diffInDays(now()) / 7);
                    $skip = Subscription::where('user_id', $user->id)->where('status', 'expired')->where('expires_at', '>', $sub->expires_at)->exists()
                        || ! $user->notifications_enabled
                        || $notice->period_key !== $sub->expires_at->toIso8601String().':'.$week
                        || ! Ad::where('user_id', $user->id)->where('hidden_reason', 'subscription_expired')->exists();
                }
                if (! $skip && $notice->kind === 'expiring') {
                    $skip = ! $sub->isActive() || $notice->period_key !== $sub->expires_at->toIso8601String();
                }
                if ($skip) {
                    $notice->update(['skipped_at' => now()]);

                    return;
                }
                Mail::to($user->email)->send(new SubscriptionLifecycleMail($notice));
                $notice->update(['sent_at' => now(), 'last_error' => null, 'attempts' => $notice->attempts + 1]);
            });
        } catch (Throwable $exception) {
            // Do not persist SMTP credentials or provider response bodies in the audit UI.
            SubscriptionNotice::whereKey($this->noticeId)->increment('attempts', 1, ['last_error' => class_basename($exception)]);
            throw $exception;
        }
    }
}

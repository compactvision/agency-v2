<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Domains\Billing\Services\SubscriptionLifecycle;
use App\Domains\Quotas\Services\QuotaEnforcer;
use App\Models\User;
use App\Support\AuditLogger;
use DomainException;
use Illuminate\Support\Facades\DB;

class ActivateSubscription
{
    public function execute(int $subscriptionId, array $paymentData = []): bool
    {
        $candidate = Subscription::findOrFail($subscriptionId);

        return DB::transaction(function () use ($subscriptionId, $paymentData, $candidate) {
            $owner = User::whereKey($candidate->user_id)->lockForUpdate()->firstOrFail();
            if ($owner->anonymized_at) {
                throw new DomainException('Cannot activate a deleted account.');
            }
            $sub = Subscription::with('plan.features')->lockForUpdate()->findOrFail($subscriptionId);
            $paymentId = $paymentData['paymentId'] ?? null;
            $adminId = $paymentData['approvedBy'] ?? null;
            if ($adminId !== null && (! User::find($adminId)?->hasRole(['admin', 'super-admin']) || $sub->payment_method === 'RDCard')) {
                throw new DomainException('Manual confirmation is not permitted.');
            }
            if ($adminId === null && (! is_string($paymentId) || $paymentId === '')) {
                throw new DomainException('A confirmed payment is required.');
            }
            // A late duplicate stays harmless even after expiry or replacement.
            if (($paymentId && $sub->payment_id === $paymentId) || ($adminId && $sub->approved_by !== null)) {
                return false;
            }
            if (! in_array($sub->status, ['pending', 'failed'], true)
                && ! ($sub->status === 'cancelled' && $sub->payment_method === 'RDCard' && $sub->payment_id === null)) {
                throw new DomainException('The subscription state does not allow activation.');
            }
            if ($paymentId && Subscription::withTrashed()->where('payment_id', $paymentId)->whereKeyNot($sub->id)->exists()) {
                throw new DomainException('The payment is already linked to another subscription.');
            }
            $rights = app(SubscriptionEntitlements::class);
            $lifecycle = app(SubscriptionLifecycle::class);
            $current = $rights->current($sub->user_id);
            // Carry forward all remaining time; the purchased period starts at the old expiry.
            $base = $current?->expires_at?->copy() ?? now();
            $expires = BillingInterval::from($sub->plan_interval ?: $sub->interval ?: $sub->plan->interval)->addTo($base);
            $previous = $sub->only(['status', 'started_at', 'expires_at']);
            // Resolve even pre-existing duplicate active rows under the same owner lock.
            Subscription::where('user_id', $sub->user_id)->where('status', 'active')->whereKeyNot($sub->id)
                ->get()->each(function ($old) {
                    $before = $old->only(['status', 'expires_at']);
                    $old->update(['status' => $old->expires_at?->lte(now()) ? 'expired' : 'cancelled', 'failure_reason' => 'Replaced by a confirmed subscription.']);
                    app(AuditLogger::class)->record('subscription.replaced', $old, 'Remplacement après paiement confirmé.', $before, $old->only(['status', 'expires_at']));
                });
            $sub->update([
                'status' => 'active', 'payment_id' => $paymentId, 'approved_by' => $adminId,
                'payment_method' => $paymentData['paymentMethod'] ?? $sub->payment_method,
                'failure_reason' => null, 'cancelled_at' => null,
                'started_at' => now(), 'expires_at' => $expires,
            ]);
            app(QuotaEnforcer::class)->applyPlanLimits($sub->user_id, $sub->plan);
            // Catch up expiration masking if renewal arrives while the scheduler was offline.
            if (! $current) {
                $lifecycle->hide($sub->user_id, 'subscription_expired');
            }
            $result = $lifecycle->reconcile($sub);
            $lifecycle->recordNotice($sub, 'activated', $expires->toIso8601String(), $result);
            app(AuditLogger::class)->record('subscription.activated', $sub, 'Abonnement activé après confirmation du paiement.',
                $previous, array_merge($sub->only(['status', 'started_at', 'expires_at', 'approved_by']), $result), 'warning');
            DB::afterCommit(fn () => event(new SubscriptionActivated($sub->user_id, $sub->plan_id, $expires, $sub->id)));

            return true;
        }, 3);
    }
}

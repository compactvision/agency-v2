<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Quotas\Services\QuotaEnforcer;
use App\Support\AuditLogger;
use DomainException;
use Illuminate\Support\Facades\DB;

/**
 * Activates a subscription after payment confirmation (webhook).
 */
class ActivateSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
        private readonly QuotaEnforcer $quotaEnforcer,
        private readonly AuditLogger $auditLogger,
    ) {}

    public function execute(int $subscriptionId, array $paymentData = []): bool
    {
        $activated = DB::transaction(function () use ($subscriptionId, $paymentData) {
            $sub = $this->subscriptions->findForUpdate($subscriptionId);
            $paymentId = $paymentData['paymentId'];

            if ($sub->status === SubscriptionStatus::Active->value) {
                if (hash_equals((string) $sub->payment_id, (string) $paymentId)) {
                    return false;
                }

                throw new DomainException('An active subscription cannot be activated with another payment.');
            }

            if (! in_array($sub->status, [
                SubscriptionStatus::Pending->value,
                SubscriptionStatus::Failed->value,
            ], true)) {
                throw new DomainException('The subscription state does not allow activation.');
            }

            $paymentAlreadyUsed = Subscription::query()
                ->where('payment_id', $paymentId)
                ->whereKeyNot($sub->id)
                ->exists();

            if ($paymentAlreadyUsed) {
                throw new DomainException('The payment is already linked to another subscription.');
            }

            $interval = BillingInterval::from(
                $sub->plan_interval ?: $sub->interval ?: $sub->plan->interval
            );
            $startedAt = now();
            $expiresAt = $interval->addTo($startedAt);

            $sub->update([
                'status' => SubscriptionStatus::Active->value,
                'payment_id' => $paymentId,
                'payment_method' => $paymentData['paymentMethod'] ?? null,
                'failure_reason' => null,
                'started_at' => $startedAt,
                'expires_at' => $expiresAt,
            ]);

            $this->quotaEnforcer->applyPlanLimits($sub->user_id, $sub->plan);

            $this->auditLogger->record(
                'subscription.activated',
                $sub,
                "Abonnement {$sub->id} activé après confirmation du paiement.",
                ['status' => $sub->getOriginal('status')],
                [
                    'status' => SubscriptionStatus::Active->value,
                    'payment_id' => $paymentId,
                    'expires_at' => $expiresAt->toISOString(),
                ],
                'warning',
            );

            DB::afterCommit(fn () => event(new SubscriptionActivated(
                userId: $sub->user_id,
                planId: $sub->plan_id,
                expiresAt: $expiresAt,
            )));

            return true;
        }, 3);

        return $activated;
    }
}

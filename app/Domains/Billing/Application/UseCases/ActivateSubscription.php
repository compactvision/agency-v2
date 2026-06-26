<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Quotas\Services\QuotaEnforcer;

/**
 * Activates a subscription after payment confirmation (webhook).
 */
class ActivateSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
        private readonly QuotaEnforcer          $quotaEnforcer,
    ) {}

    public function execute(int $subscriptionId, array $paymentData = []): void
    {
        $sub = $this->subscriptions->findOrFail($subscriptionId);

        $interval  = BillingInterval::from($sub->plan->interval);
        $expiresAt = $interval->addTo(now());

        $sub->update([
            'status'         => SubscriptionStatus::Active->value,
            'payment_id'     => $paymentData['paymentId']     ?? null,
            'payment_method' => $paymentData['paymentMethod'] ?? null,
            'started_at'     => now(),
            'expires_at'     => $expiresAt,
        ]);

        // Apply plan limits to quota
        $this->quotaEnforcer->applyPlanLimits($sub->user_id, $sub->plan);

        event(new SubscriptionActivated(
            userId:    $sub->user_id,
            planId:    $sub->plan_id,
            expiresAt: $expiresAt,
        ));
    }
}

<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\ApproveSubscriptionCommand;
use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Quotas\Services\QuotaEnforcer;
use Illuminate\Support\Facades\Log;

class ApproveManualSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
        private readonly QuotaEnforcer          $quotaEnforcer,
    ) {}

    public function execute(ApproveSubscriptionCommand $cmd): void
    {
        $sub = $this->subscriptions->findOrFail($cmd->subscriptionId);

        if ($sub->status !== SubscriptionStatus::Pending->value) {
            Log::warning("Tried to approve non-pending subscription #{$cmd->subscriptionId}");
            return;
        }

        $interval = BillingInterval::from($sub->plan->interval);
        $expiresAt = $interval->addTo(now());

        $sub->update([
            'status'     => SubscriptionStatus::Active->value,
            'started_at' => now(),
            'expires_at' => $expiresAt,
        ]);

        // Apply plan limits to user's quota
        $this->quotaEnforcer->applyPlanLimits($sub->user_id, $sub->plan);

        event(new SubscriptionActivated(
            userId:    $sub->user_id,
            planId:    $sub->plan_id,
            expiresAt: $expiresAt,
        ));
    }
}

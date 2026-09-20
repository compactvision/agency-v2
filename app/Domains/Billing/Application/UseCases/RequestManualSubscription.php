<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\RequestManualSubscriptionCommand;
use App\Domains\Billing\Domain\Events\ManualSubscriptionRequested;
use App\Domains\Billing\Infrastructure\Repositories\PlanRepository;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;

class RequestManualSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
        private readonly PlanRepository $plans,
    ) {}

    public function execute(RequestManualSubscriptionCommand $cmd): void
    {
        $plan = $this->plans->findOrFail($cmd->planId);

        if (! $plan->is_active || $plan->payment_method !== 'manual') {
            throw new \DomainException('This plan does not support manual payments.');
        }

        $subscription = $this->subscriptions->createPending($cmd->userId, $plan);

        event(new ManualSubscriptionRequested(
            userId: $cmd->userId,
            planId: $plan->id,
            planName: $plan->name,
            subscriptionId: $subscription->id,
        ));
    }
}

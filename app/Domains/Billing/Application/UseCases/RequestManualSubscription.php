<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\RequestManualSubscriptionCommand;
use App\Domains\Billing\Domain\Events\ManualSubscriptionRequested;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Infrastructure\Repositories\PlanRepository;

class RequestManualSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
        private readonly PlanRepository         $plans,
    ) {}

    public function execute(RequestManualSubscriptionCommand $cmd): void
    {
        $plan = $this->plans->findOrFail($cmd->planId);

        $subscription = $this->subscriptions->createPending($cmd->userId, $plan);

        event(new ManualSubscriptionRequested(
            userId:         $cmd->userId,
            planId:         $plan->id,
            planName:       $plan->name,
            subscriptionId: $subscription->id,
        ));
    }
}

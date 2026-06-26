<?php

namespace App\Domains\Billing\Domain\Events;

final class ManualSubscriptionRequested
{
    public function __construct(
        public readonly int    $userId,
        public readonly int    $planId,
        public readonly string $planName,
        public readonly int    $subscriptionId,
    ) {}
}

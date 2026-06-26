<?php

namespace App\Domains\Billing\Domain\Events;

final class SubscriptionCancelled
{
    public function __construct(
        public readonly int $userId,
        public readonly int $planId,
    ) {}
}

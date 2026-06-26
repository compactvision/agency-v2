<?php

namespace App\Domains\Billing\Application\Commands;

final class RequestManualSubscriptionCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly int $planId,
    ) {}
}

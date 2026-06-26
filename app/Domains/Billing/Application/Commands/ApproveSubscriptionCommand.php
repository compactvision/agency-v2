<?php

namespace App\Domains\Billing\Application\Commands;

final class ApproveSubscriptionCommand
{
    public function __construct(
        public readonly int $subscriptionId,
        public readonly int $adminId,
    ) {}
}

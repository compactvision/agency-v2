<?php

namespace App\Domains\Billing\Application\Commands;

final class RejectSubscriptionCommand
{
    public function __construct(
        public readonly int    $subscriptionId,
        public readonly int    $adminId,
        public readonly string $reason = '',
    ) {}
}

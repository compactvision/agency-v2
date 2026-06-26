<?php

namespace App\Domains\Billing\Domain\Events;

use Carbon\Carbon;

final class SubscriptionActivated
{
    public function __construct(
        public readonly int    $userId,
        public readonly int    $planId,
        public readonly Carbon $expiresAt,
    ) {}
}

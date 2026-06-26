<?php

namespace App\Domains\Billing\Application\DTOs;

use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Domain\ValueObjects\PlanLimits;

final class PlanDTO
{
    public function __construct(
        public readonly int            $id,
        public readonly string         $name,
        public readonly ?string        $description,
        public readonly float          $price,
        public readonly BillingInterval $interval,
        public readonly string         $paymentMethod,
        public readonly bool           $isActive,
        public readonly int            $position,
        public readonly PlanLimits     $limits,
    ) {}
}

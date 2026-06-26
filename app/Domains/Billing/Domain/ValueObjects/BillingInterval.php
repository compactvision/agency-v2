<?php

namespace App\Domains\Billing\Domain\ValueObjects;

use Carbon\Carbon;

enum BillingInterval: string
{
    case Monthly = 'monthly';
    case Yearly  = 'yearly';

    public function toMonths(): int
    {
        return match($this) {
            self::Monthly => 1,
            self::Yearly  => 12,
        };
    }

    public function addTo(Carbon $date): Carbon
    {
        return match($this) {
            self::Monthly => $date->copy()->addMonth(),
            self::Yearly  => $date->copy()->addYear(),
        };
    }

    public function label(): string
    {
        return match($this) {
            self::Monthly => 'Mensuel',
            self::Yearly  => 'Annuel',
        };
    }
}

<?php

namespace App\Domains\Billing\Application\DTOs;

use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use Carbon\Carbon;

final class SubscriptionDTO
{
    public function __construct(
        public readonly int                $id,
        public readonly int                $userId,
        public readonly int                $planId,
        public readonly string             $planName,
        public readonly SubscriptionStatus $status,
        public readonly float              $amount,
        public readonly string             $currency,
        public readonly ?Carbon            $startedAt,
        public readonly ?Carbon            $expiresAt,
        public readonly string             $transactionId,
        public readonly ?string            $paymentMethod,
    ) {}

    public function isActive(): bool
    {
        return $this->status->isActive()
            && ($this->expiresAt === null || $this->expiresAt->isFuture());
    }

    public function daysUntilExpiration(): ?int
    {
        return $this->expiresAt?->diffInDays(now(), false);
    }
}

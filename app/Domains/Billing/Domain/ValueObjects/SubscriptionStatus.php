<?php

namespace App\Domains\Billing\Domain\ValueObjects;

enum SubscriptionStatus: string
{
    case Pending          = 'pending';
    case Active           = 'active';
    case Expired          = 'expired';
    case Cancelled        = 'cancelled';
    case Failed           = 'failed';
    case RefundPending    = 'refund_pending';
    case Refunded         = 'refunded';

    public function isActive(): bool
    {
        return $this === self::Active;
    }

    public function label(): string
    {
        return match($this) {
            self::Pending       => 'En attente',
            self::Active        => 'Actif',
            self::Expired       => 'Expiré',
            self::Cancelled     => 'Annulé',
            self::Failed        => 'Échoué',
            self::RefundPending => 'Remboursement en attente',
            self::Refunded      => 'Remboursé',
        };
    }
}

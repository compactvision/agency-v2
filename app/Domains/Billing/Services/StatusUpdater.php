<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use DomainException;

/**
 * Handles payment gateway webhook events and delegates to Use Cases.
 */
class StatusUpdater
{
    public function __construct(
        protected SubscriptionRepository $subscriptions,
        protected ActivateSubscription $activateSubscription,
    ) {}

    public function paymentSucceeded(array $event): void
    {
        $data = $event['data'] ?? [];
        $transactionId = $data['transactionId'] ?? null;
        $paymentId = $data['paymentId'] ?? null;
        $amount = $data['amount'] ?? null;
        $currency = $data['currency'] ?? null;

        if (! is_string($transactionId) || $transactionId === ''
            || ! is_string($paymentId) || $paymentId === ''
            || ! is_numeric($amount)
            || ! is_string($currency) || $currency === '') {
            throw new DomainException('Incomplete successful payment event.');
        }

        $sub = $this->subscriptions->findByTransactionId($transactionId);

        if (! $sub) {
            throw new DomainException('Subscription not found for payment event.');
        }

        $multiplier = max((int) config('billing.acoriss.webhook_amount_multiplier', 100), 1);
        $expectedAmount = (int) round((float) $sub->amount * $multiplier);

        if ((int) round((float) $amount) !== $expectedAmount
            || strtoupper($currency) !== strtoupper($sub->currency)) {
            throw new DomainException('Payment amount or currency does not match the subscription.');
        }

        $this->activateSubscription->execute($sub->id, $data);
    }

    public function paymentFailed(array $event): void
    {
        $transactionId = $event['data']['transactionId'] ?? null;
        $reason = $event['data']['reason'] ?? 'Unknown error';

        $sub = $this->subscriptions->findByTransactionId($transactionId);

        if ($sub && in_array($sub->status, [
            SubscriptionStatus::Pending->value,
            SubscriptionStatus::Failed->value,
        ], true)) {
            $sub->update([
                'status' => SubscriptionStatus::Failed->value,
                'failure_reason' => $reason,
            ]);
        }
    }

    public function paymentPending(array $event): void
    {
        $sub = $this->subscriptions->findByTransactionId(
            $event['data']['transactionId'] ?? null
        );

        // A delayed "pending" event must never downgrade a terminal or active state.
    }

    public function refundCompleted(array $event): void
    {
        $paymentId = $event['data']['paymentId'] ?? null;
        $sub = $this->subscriptions->findByPaymentId($paymentId);

        if ($sub && $sub->status === SubscriptionStatus::Active->value) {
            $sub->update([
                'status' => SubscriptionStatus::Refunded->value,
                'expires_at' => now(),
            ]);
        }
    }
}

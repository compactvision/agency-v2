<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use Illuminate\Support\Facades\Log;

/**
 * Handles payment gateway webhook events and delegates to Use Cases.
 */
class StatusUpdater
{
    public function __construct(
        protected SubscriptionRepository $subscriptions,
        protected ActivateSubscription   $activateSubscription,
    ) {}

    public function paymentSucceeded(array $event): void
    {
        $transactionId = $event['data']['transactionId'] ?? null;
        $sub = $this->subscriptions->findByTransactionId($transactionId);

        if (!$sub) {
            Log::error('Subscription not found for succeeded transaction', $event);
            return;
        }

        $this->activateSubscription->execute($sub->id, $event['data']);
    }

    public function paymentFailed(array $event): void
    {
        $transactionId = $event['data']['transactionId'] ?? null;
        $reason        = $event['data']['reason'] ?? 'Unknown error';

        $sub = $this->subscriptions->findByTransactionId($transactionId);

        if ($sub) {
            $sub->update([
                'status'         => SubscriptionStatus::Failed->value,
                'failure_reason' => $reason,
            ]);
        }
    }

    public function paymentPending(array $event): void
    {
        $sub = $this->subscriptions->findByTransactionId(
            $event['data']['transactionId'] ?? null
        );

        if ($sub && $sub->status !== SubscriptionStatus::Pending->value) {
            $sub->update(['status' => SubscriptionStatus::Pending->value]);
        }
    }

    public function refundCompleted(array $event): void
    {
        $paymentId = $event['data']['paymentId'] ?? null;
        $sub = $this->subscriptions->findByPaymentId($paymentId);

        if ($sub) {
            $sub->update([
                'status'     => SubscriptionStatus::Refunded->value,
                'expires_at' => now(),
            ]);
        }
    }
}

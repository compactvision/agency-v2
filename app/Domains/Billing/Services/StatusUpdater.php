<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use App\Support\AuditLogger;
use DomainException;
use Illuminate\Support\Facades\DB;

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

        if ((float) $amount !== (float) $expectedAmount
            || strtoupper($currency) !== strtoupper($sub->currency)) {
            throw new DomainException('Payment amount or currency does not match the subscription.');
        }

        $email = $data['customer']['email'] ?? null;
        if ($email !== null && (! is_string($email) || strcasecmp($email, $sub->payment_customer_email ?? $sub->user->email) !== 0)) {
            throw new DomainException('Payment customer does not match the subscription.');
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
            Subscription::whereKey($sub->id)->whereIn('status', ['pending', 'failed'])->update([
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

        if ($sub) {
            DB::transaction(function () use ($sub) {
                User::whereKey($sub->user_id)->lockForUpdate()->firstOrFail();
                $sub = Subscription::whereKey($sub->id)->lockForUpdate()->firstOrFail();
                if ($sub->status !== 'active') {
                    return;
                }
                app(SubscriptionLifecycle::class)->cancel($sub, true, 'Paiement remboursé.');
                $sub->refresh()->update(['status' => 'refunded']);
                app(AuditLogger::class)->record('subscription.refunded', $sub, 'Remboursement confirmé.', ['status' => 'active'], ['status' => 'refunded'], 'warning');
            }, 3);
        }
    }
}

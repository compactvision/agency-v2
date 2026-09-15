<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Models\Subscription;
use DomainException;
use Illuminate\Support\Facades\DB;

class RdcardPaymentService
{
    public function apply(Subscription $subscription, array $payment, string $event): void
    {
        if ($subscription->payment_method !== 'RDCard'
            || ! is_string($payment['id'] ?? null)
            || $payment['id'] !== $subscription->payment_session_id
            || ($payment['transactionId'] ?? null) !== $subscription->transaction_id
            || ! is_numeric($payment['amount'] ?? null)
            || (float) $payment['amount'] !== (float) $subscription->amount
            || ($payment['currency'] ?? null) !== $subscription->currency) {
            throw new DomainException('RDCard payment does not match the subscription.');
        }

        DB::transaction(function () use ($subscription, $payment, $event) {
            $sub = Subscription::query()->lockForUpdate()->findOrFail($subscription->id);
            if ($event === 'payment.succeeded') {
                app(ActivateSubscription::class)->execute($sub->id, [
                    'paymentId' => $payment['id'],
                    'paymentMethod' => 'RDCard',
                ]);
            } elseif (in_array($event, ['payment.failed', 'payment.canceled'], true)
                && in_array($sub->status, ['pending', 'failed'], true)) {
                // An unsuccessful attempt can still be followed by a successful retry.
                $sub->update([
                    'status' => 'failed',
                    'failure_reason' => $event === 'payment.canceled' ? 'Paiement annulé.' : 'Paiement refusé.',
                ]);
            }
        }, 3);
    }
}

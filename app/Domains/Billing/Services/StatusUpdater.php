<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Subscription;
use Illuminate\Support\Facades\Log;

class StatusUpdater
{
    public function __construct(
        protected SubscriptionManager $subscriptions
    ) {}

    public function paymentSucceeded(array $event)
    {
        $transactionId = $event['data']['transactionId'] ?? null;
        $sub = Subscription::where('transaction_id', $transactionId)->first();

        if (!$sub) {
            Log::error("Subscription not found for succeeded transaction", $event);
            return;
        }

        $this->subscriptions->activate($sub, $event);
    }

    public function paymentFailed(array $event)
    {
        $transactionId = $event['data']['transactionId'] ?? null;
        $reason = $event['data']['reason'] ?? 'Unknown error';

        $sub = Subscription::where('transaction_id', $transactionId)->first();

        if ($sub) {
            $this->subscriptions->markFailed($sub, $reason);
        }
    }

    public function paymentPending(array $event)
    {
        $sub = Subscription::where('transaction_id', $event['data']['transactionId'] ?? null)->first();
        if ($sub) {
            $this->subscriptions->markPending($sub);
        }
    }

    public function refundCompleted(array $event)
    {
        $paymentId = $event['data']['paymentId'] ?? null;

        $sub = Subscription::where('payment_id', $paymentId)->first();
        if ($sub) {
            $this->subscriptions->markRefunded($sub);
        }
    }
}

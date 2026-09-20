<?php

namespace App\Domains\Billing\Webhooks;

use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\WebhookLog;
use App\Domains\Billing\Services\RdcardPaymentService;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class RdcardWebhookHandler
{
    public function __invoke(Request $request, RdcardPaymentService $payments)
    {
        $secret = config('billing.rdcard.secret');
        $signature = $request->header('X-Signature');
        if (! is_string($secret) || $secret === '' || ! is_string($signature)
            || ! hash_equals(hash_hmac('sha256', $request->getContent(), $secret), $signature)) {
            return response()->json(['message' => 'Invalid webhook signature'], 401);
        }

        $event = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'id' => ['sometimes', 'string', 'max:255'],
            'data' => ['required', 'array'],
        ]);
        if (! in_array($event['type'], ['payment.initialized', 'payment.succeeded', 'payment.failed', 'payment.canceled'], true)) {
            return response()->json(['ignored' => true]);
        }
        $payment = $event['data']['payment'] ?? null;
        if (! is_array($payment) || ! is_string($payment['transactionId'] ?? null)) {
            return response()->json(['message' => 'Invalid payment payload'], 422);
        }
        $subscription = Subscription::where('transaction_id', $payment['transactionId'])->first();
        if (! $subscription || ! $subscription->payment_session_id) {
            // A callback can arrive before the create-session response is persisted.
            return response()->json(['message' => 'Payment session not ready'], 503);
        }

        try {
            $payments->apply($subscription, $payment, $event['type']);
        } catch (DomainException $exception) {
            Log::warning('Rejected RDCard payment event', ['subscription_id' => $subscription->id, 'event_type' => $event['type'], 'reason' => $exception->getMessage()]);

            return response()->json(['message' => 'Payment payload rejected'], 422);
        }

        WebhookLog::create([
            'event_type' => $event['type'],
            'payload' => [
                'id' => $event['id'] ?? null,
                'type' => $event['type'],
                'data' => ['payment' => Arr::only($payment, ['id', 'transactionId', 'amount', 'currency'])],
            ],
            'ip_address' => $request->ip(),
            'headers' => ['content-type' => $request->header('Content-Type')],
            'received_at' => now(),
        ]);

        return response()->json(['ok' => true]);
    }
}

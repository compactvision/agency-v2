<?php

namespace App\Domains\Billing\Webhooks;

use App\Domains\Billing\Models\WebhookLog;
use App\Domains\Billing\Services\StatusUpdater;
use DomainException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class AcorissWebhookHandler
{
    public function __construct(
        protected StatusUpdater $status
    ) {}

    public function __invoke(Request $request)
    {
        if (! $this->hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid webhook signature'], 401);
        }

        $event = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'data' => ['sometimes', 'array'],
        ]);

        WebhookLog::create([
            'event_type' => $event['type'],
            'payload' => $this->redactSensitiveData($event),
            'ip_address' => $request->ip(),
            'headers' => array_filter([
                'content-type' => $request->header('Content-Type'),
                'user-agent' => $request->userAgent(),
                'event-id' => $request->header('X-Acoriss-Event-Id'),
            ]),
            'received_at' => now(),
        ]);

        try {
            return match ($event['type']) {
                'payment.succeeded' => $this->handleSucceeded($event),
                'payment.failed' => $this->handleFailed($event),
                'payment.pending' => $this->handlePending($event),
                'refund.completed' => $this->handleRefundCompleted($event),
                default => response()->json(['ignored' => true], 200),
            };
        } catch (DomainException $exception) {
            Log::warning('Rejected Acoriss webhook payload', [
                'event_type' => $event['type'],
                'reason' => $exception->getMessage(),
            ]);

            return response()->json(['message' => 'Webhook payload rejected'], 422);
        }
    }

    private function hasValidSignature(Request $request): bool
    {
        $secret = config('billing.acoriss.webhook_secret');
        $header = config('billing.acoriss.webhook_signature_header');

        if (! is_string($secret) || $secret === '' || ! is_string($header) || $header === '') {
            return false;
        }

        $provided = $request->header($header);

        if (! is_string($provided) || $provided === '') {
            return false;
        }

        $provided = str_starts_with($provided, 'sha256=')
            ? substr($provided, 7)
            : $provided;

        $expected = hash_hmac('sha256', $request->getContent(), $secret);

        return hash_equals($expected, $provided);
    }

    private function redactSensitiveData(array $event): array
    {
        if (! isset($event['data']) || ! is_array($event['data'])) {
            return $event;
        }

        $event['data'] = Arr::except($event['data'], [
            'card',
            'cardNumber',
            'cvv',
            'token',
            'authorization',
        ]);

        return $event;
    }

    protected function handleSucceeded(array $event)
    {
        $this->status->paymentSucceeded($event);

        return response()->json(['ok' => true]);
    }

    protected function handleFailed(array $event)
    {
        $this->status->paymentFailed($event);

        return response()->json(['ok' => true]);
    }

    protected function handlePending(array $event)
    {
        $this->status->paymentPending($event);

        return response()->json(['ok' => true]);
    }

    protected function handleRefundCompleted(array $event)
    {
        $this->status->refundCompleted($event);

        return response()->json(['ok' => true]);
    }
}

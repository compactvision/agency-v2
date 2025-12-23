<?php

namespace App\Domains\Billing\Webhooks;

use App\Domains\Billing\Models\WebhookLog;
use App\Domains\Billing\Services\StatusUpdater;
use Illuminate\Http\Request;

class AcorissWebhookHandler
{
    public function __construct(
        protected StatusUpdater $status
    ) {}

    public function __invoke(Request $request)
    {
        WebhookLog::create([
            'event_type' => $request->input('type'),
            'payload'    => $request->all(),
            'ip_address' => $request->ip(),
            'headers'    => $request->headers->all(),
            'received_at'=> now(),
        ]);

        $event = $request->all();
        $type  = $event['type'] ?? null;

        if (!$type) {
            return response()->json(['received' => false], 400);
        }

        return match ($type) {
            'payment.succeeded' => $this->handleSucceeded($event),
            'payment.failed'    => $this->handleFailed($event),
            'payment.pending'   => $this->handlePending($event),
            'refund.completed'  => $this->handleRefundCompleted($event),
            default             => response()->json(['ignored' => true], 200),
        };
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

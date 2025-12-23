<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;

class SubscriptionManager
{
    public function createPending(int $userId, Plan $plan): Subscription
    {
        return Subscription::updateOrCreate(
            ['user_id' => $userId],
            [
                'plan_id'        => $plan->id,
                'transaction_id' => 'sub_' . $userId . '_' . $plan->id . '_' . time(),
                'status'         => 'pending',
                'amount'         => $plan->price,
                'currency'       => 'USD',
            ]
        );
    }

    public function attachPaymentSession(Subscription $sub, string $sessionId): void
    {
        $sub->payment_session_id = $sessionId;
        $sub->save();
    }

    public function activate(Subscription $sub, array $event): Subscription
    {
        $sub->update([
            'status'        => 'active',
            'payment_id'    => $event['data']['paymentId'] ?? null,
            'payment_method'=> $event['data']['paymentMethod'] ?? null,
            'started_at'    => now(),
            'expires_at'    => now()->addMonth(),
        ]);

        return $sub;
    }

    public function markFailed(Subscription $sub, string $reason): void
    {
        $sub->update([
            'status' => 'failed',
            'failure_reason' => $reason,
        ]);
    }

    public function markPending(Subscription $sub): void
    {
        if ($sub->status !== 'pending') {
            $sub->update(['status' => 'pending']);
        }
    }

    public function markRefunded(Subscription $sub): void
    {
        $sub->update([
            'status' => 'refunded',
            'expires_at' => now(),
        ]);
    }
}

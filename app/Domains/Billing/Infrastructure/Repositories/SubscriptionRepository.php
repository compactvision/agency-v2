<?php

namespace App\Domains\Billing\Infrastructure\Repositories;

use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\Plan;

class SubscriptionRepository
{
    public function findOrFail(int $id): Subscription
    {
        return Subscription::with(['plan', 'user'])->findOrFail($id);
    }

    public function findByTransactionId(string $transactionId): ?Subscription
    {
        return Subscription::with(['plan', 'user'])
            ->where('transaction_id', $transactionId)
            ->first();
    }

    public function findByPaymentId(string $paymentId): ?Subscription
    {
        return Subscription::with(['plan', 'user'])
            ->where('payment_id', $paymentId)
            ->first();
    }

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
                'started_at'     => null,
                'expires_at'     => null,
            ]
        );
    }

    public function findActiveByUserId(int $userId): ?Subscription
    {
        return Subscription::with('plan')
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
            })
            ->latest()
            ->first();
    }

    /**
     * Find subscriptions expiring on a specific date (for reminders).
     */
    public function findExpiringOn(string $date): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::with(['user', 'plan'])
            ->where('status', 'active')
            ->whereDate('expires_at', $date)
            ->get();
    }

    /**
     * Find all active subscriptions that have passed their expiry.
     */
    public function findExpired(): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::with('plan')
            ->where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();
    }
}

<?php

namespace App\Domains\Billing\Infrastructure\Repositories;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class SubscriptionRepository
{
    public function findOrFail(int $id): Subscription
    {
        return Subscription::with(['plan', 'user'])->findOrFail($id);
    }

    public function findForUpdate(int $id): Subscription
    {
        return Subscription::with(['plan.features', 'user'])
            ->lockForUpdate()
            ->findOrFail($id);
    }

    public function findByTransactionId(?string $transactionId): ?Subscription
    {
        if (! $transactionId) {
            return null;
        }

        return Subscription::with(['plan', 'user'])
            ->where('transaction_id', $transactionId)
            ->first();
    }

    public function findByPaymentId(?string $paymentId): ?Subscription
    {
        if (! $paymentId) {
            return null;
        }

        return Subscription::with(['plan', 'user'])
            ->where('payment_id', $paymentId)
            ->first();
    }

    public function createPending(int $userId, Plan $plan): Subscription
    {
        return Subscription::create([
            'user_id' => $userId,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_interval' => $plan->interval,
            'plan_features' => $this->snapshotFeatures($plan),
            'transaction_id' => 'sub_'.$userId.'_'.$plan->id.'_'.Str::uuid(),
            'status' => 'pending',
            'amount' => $plan->price,
            'currency' => 'USD',
            'interval' => $plan->interval,
            'started_at' => null,
            'expires_at' => null,
        ]);
    }

    private function snapshotFeatures(Plan $plan): array
    {
        return $plan->features()
            ->get(['name', 'value'])
            ->map(fn ($feature) => $feature->only(['name', 'value']))
            ->values()
            ->all();
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
    public function findExpiringOn(string $date): Collection
    {
        return Subscription::with(['user', 'plan'])
            ->where('status', 'active')
            ->whereDate('expires_at', $date)
            ->get();
    }

    /**
     * Find all active subscriptions that have passed their expiry.
     */
    public function findExpired(): Collection
    {
        return Subscription::with('plan')
            ->where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();
    }
}

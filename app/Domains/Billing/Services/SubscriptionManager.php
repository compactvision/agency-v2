<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Str;

class SubscriptionManager
{
    public function list(array $filters = [])
    {
        $query = Subscription::with(['user' => fn ($q) => $q->withCount(['ads as hidden_ads_count' => fn ($ads) => $ads->whereIn('hidden_reason', ['subscription_expired', 'plan_limit', 'subscription_cancelled'])]), 'plan', 'notices' => fn ($q) => $q->latest('id')->limit(12)]);
        if (($filters['status'] ?? null) === 'expiring') {
            $query->usable()->where('expires_at', '<=', now()->addDays(7));
        } elseif (in_array($filters['status'] ?? null, ['active', 'pending', 'expired', 'cancelled', 'failed', 'refunded'], true)) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate(min(100, max(1, (int) ($filters['per_page'] ?? 10))));
    }

    public function createPending(int $userId, Plan $plan): Subscription
    {
        return Subscription::create([
            'user_id' => $userId,
            'payment_customer_email' => User::findOrFail($userId)->email,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_interval' => $plan->interval,
            'plan_features' => $plan->features()
                ->get(['name', 'value'])
                ->map(fn ($feature) => $feature->only(['name', 'value']))
                ->values()
                ->all(),
            'transaction_id' => 'sub_'.Str::uuid(),
            'status' => 'pending',
            'amount' => $plan->price,
            'currency' => 'USD',
            'interval' => $plan->interval,
        ]);
    }

    public function attachPaymentSession(Subscription $sub, string $sessionId): void
    {
        $sub->payment_session_id = $sessionId;
        $sub->save();
    }

    public function activate(Subscription $sub, array $event): Subscription
    {
        app(StatusUpdater::class)->paymentSucceeded($event);

        return $sub->refresh();
    }

    public function markFailed(Subscription $sub, string $reason): void
    {
        Subscription::whereKey($sub->id)->whereIn('status', ['pending', 'failed'])->update([
            'status' => 'failed',
            'failure_reason' => $reason,
        ]);
    }

    public function markPending(Subscription $sub): void
    {
        // A delayed pending event must never overwrite a confirmed or terminal state.
    }

    public function markRefunded(Subscription $sub): void
    {
        app(StatusUpdater::class)->refundCompleted(['data' => ['paymentId' => $sub->payment_id]]);
    }
}

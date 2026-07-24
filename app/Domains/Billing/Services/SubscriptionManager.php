<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use Illuminate\Support\Str;

class SubscriptionManager
{
    public function list(array $filters = [])
    {
        $query = Subscription::with(['user', 'plan']);

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

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function createPending(int $userId, Plan $plan): Subscription
    {
        return Subscription::create([
            'user_id' => $userId,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_interval' => $plan->interval,
            'plan_features' => $plan->features()
                ->get(['name', 'value'])
                ->map(fn ($feature) => $feature->only(['name', 'value']))
                ->values()
                ->all(),
            'transaction_id' => 'sub_'.$userId.'_'.$plan->id.'_'.Str::uuid(),
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
        $interval = BillingInterval::from(
            $sub->plan_interval ?: $sub->interval ?: $sub->plan->interval
        );

        $sub->update([
            'status' => 'active',
            'payment_id' => $event['data']['paymentId'] ?? null,
            'payment_method' => $event['data']['paymentMethod'] ?? null,
            'started_at' => now(),
            'expires_at' => $interval->addTo(now()),
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

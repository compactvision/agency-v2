<?php

namespace App\Domains\Billing\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdSchemaValidator;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class SubscriptionEntitlements
{
    public function current(int $userId): ?Subscription
    {
        return Subscription::with('plan.features')->where('user_id', $userId)->usable()
            ->whereHas('user', fn ($q) => $q->whereNull('anonymized_at'))
            ->orderByDesc('expires_at')->orderByDesc('id')->first();
    }

    public function published(int $userId)
    {
        return Ad::where('user_id', $userId)->where('status', 'published')
            ->where('is_published', true)->where('is_approved', true)->whereNull('hidden_reason');
    }

    // Call inside a transaction. All publication/payment/lifecycle paths lock the owner first.
    public function assertCanPublish(Ad $ad, bool $reservePending = false): Subscription
    {
        User::whereKey($ad->user_id)->lockForUpdate()->firstOrFail();
        $subscription = $this->current($ad->user_id);
        if (! $subscription) {
            throw ValidationException::withMessages(['is_published' => 'Vous devez souscrire ou renouveler votre abonnement pour publier ce bien.']);
        }
        $query = $this->published($ad->user_id)->whereKeyNot($ad->id);
        $used = $query->count();
        if ($reservePending) {
            $used += Ad::where('user_id', $ad->user_id)->whereKeyNot($ad->id)
                ->where('status', 'pending_validation')->where('is_published', true)->count();
        }
        $limit = $subscription->limits()->listingLimit;
        if ($used >= $limit) {
            throw ValidationException::withMessages(['is_published' => "Votre formule autorise au maximum {$limit} biens actifs. La limite est atteinte."]);
        }

        return $subscription;
    }

    public function assertListingReady(Ad $ad): void
    {
        if (! filled($ad->title) || $ad->price === null || (float) $ad->price < 0) {
            throw ValidationException::withMessages(['is_published' => 'Complétez le titre et le prix du bien avant sa publication.']);
        }
        app(AdSchemaValidator::class)->validate([
            'category_id' => $ad->category_id, 'ad_type' => $ad->ad_type,
            'is_published' => true, 'details' => $ad->details?->details ?? [],
        ], 'create');
    }

    public function summary(int $userId): array
    {
        $current = $this->current($userId);
        $latest = $current ?? Subscription::with('plan.features')->where('user_id', $userId)->latest('id')->first();
        $limit = $current?->limits()->listingLimit ?? 0;

        return [
            'plan_name' => $latest?->plan_name ?? $latest?->plan?->name,
            'status' => $current ? 'active' : ($latest?->status === 'active' ? 'expired' : ($latest?->status ?? 'none')),
            'started_at' => $latest?->started_at?->toIso8601String(),
            'expires_at' => $latest?->expires_at?->toIso8601String(),
            'days_remaining' => $current ? (int) ceil(now()->diffInDays($current->expires_at, false)) : 0,
            'published' => $current ? $this->published($userId)->count() : 0,
            'limit' => $limit === PHP_INT_MAX ? null : $limit,
            'hidden' => Ad::where('user_id', $userId)->whereIn('hidden_reason', ['subscription_expired', 'plan_limit', 'subscription_cancelled'])->count(),
            'plan_id' => $latest?->plan_id,
        ];
    }
}

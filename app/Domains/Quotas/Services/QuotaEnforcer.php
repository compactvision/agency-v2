<?php

namespace App\Domains\Quotas\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Domain\ValueObjects\PlanLimits;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Domains\Quotas\Models\Quota;
use Illuminate\Validation\ValidationException;

class QuotaEnforcer
{
    public function applyPlanLimits(int $userId, Plan $plan): void
    {
        $sub = app(SubscriptionEntitlements::class)->current($userId);
        Quota::updateOrCreate(['user_id' => $userId], [
            'plan_id' => $plan->id,
            'used_listings' => app(SubscriptionEntitlements::class)->published($userId)->count(),
            'period_start' => $sub?->started_at, 'period_end' => $sub?->expires_at,
        ]);
    }

    public function getStatus(int $userId, ?Subscription $subscription): array
    {
        $sub = app(SubscriptionEntitlements::class)->current($userId);
        $used = app(SubscriptionEntitlements::class)->published($userId)->count();
        $max = $sub?->limits()->listingLimit ?? 0;

        return [
            'allowed' => $max === PHP_INT_MAX ? 'unlimited' : $max,
            'used' => $used, 'remaining' => $max === PHP_INT_MAX ? 'unlimited' : max(0, $max - $used),
            'plan_quota' => $max, 'plan_name' => $sub?->plan_name ?? $sub?->plan?->name,
            'limits' => $sub?->limits()->toArray() ?? [],
        ];
    }

    public function canPublishListing(int $userId): bool
    {
        $status = $this->getStatus($userId, null);

        return $status['remaining'] === 'unlimited' || $status['remaining'] > 0;
    }

    public function getPlanQuota(int $planId): int
    {
        return PlanLimits::fromFeatures(Plan::with('features')->find($planId)?->features ?? collect())->listingLimit;
    }

    public function check(int $userId, ?Subscription $subscription): array
    {
        return $this->getStatus($userId, $subscription);
    }

    public function consume(int $userId, ?Subscription $subscription, int $amount = 1): array
    {
        $status = $this->getStatus($userId, $subscription);
        if ($status['remaining'] !== 'unlimited' && $status['remaining'] < $amount) {
            throw ValidationException::withMessages(['is_published' => 'Votre abonnement ne permet pas de publier davantage de biens.']);
        }

        return $status;
    }

    public function consumeListing(int $userId): void
    {
        // Informational cache only: authorization always counts live rows under the owner lock.
        Quota::where('user_id', $userId)->update(['used_listings' => app(SubscriptionEntitlements::class)->published($userId)->count()]);
    }

    public function getMaxImagesPerAd(?Subscription $subscription): int
    {
        return $subscription?->isActive() ? $subscription->limits()->imageLimit : 0;
    }

    public function canAddImages(Ad $ad, int $incomingCount): bool
    {
        return $ad->images()->count() + $incomingCount <= $this->getMaxImagesPerAd(app(SubscriptionEntitlements::class)->current($ad->user_id));
    }

    public function countUserAdsThisMonth(int $userId): int
    {
        // Legacy API name retained: quota now counts simultaneous public properties.
        return app(SubscriptionEntitlements::class)->published($userId)->count();
    }

    public function reset(int $userId, int $planId): void
    {
        $this->consumeListing($userId);
    }
}

<?php

namespace App\Domains\Quotas\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Domain\ValueObjects\PlanLimits;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Quotas\Models\Quota;

/**
 * Centralized service for enforcing plan limits across the application.
 * This replaces and extends the previous QuotaService.
 */
class QuotaEnforcer
{
    /**
     * Snapshot plan limits into the user's quota row when a subscription is activated.
     */
    public function applyPlanLimits(int $userId, Plan $plan): void
    {
        $limits = PlanLimits::fromFeatures($plan->features);

        Quota::updateOrCreate(
            ['user_id' => $userId],
            [
                'plan_id'       => $plan->id,
                'used_listings' => 0, // Reset on new period
                'period_start'  => now(),
                'period_end'    => now()->addMonths(
                    \App\Domains\Billing\Domain\ValueObjects\BillingInterval::from($plan->interval)->toMonths()
                ),
            ]
        );
    }

    /**
     * Check if user can publish a new listing.
     */
    public function canPublishListing(int $userId): bool
    {
        $quota = Quota::where('user_id', $userId)->first();

        if (!$quota) {
            return false;
        }

        $plan   = Plan::with('features')->find($quota->plan_id);
        $limits = PlanLimits::fromFeatures($plan?->features ?? collect());

        // 0 means unlimited
        if ($limits->listingLimit === 0) {
            return true;
        }

        return $quota->used_listings < $limits->listingLimit;
    }

    /**
     * Increment listing usage counter.
     */
    public function consumeListing(int $userId): void
    {
        Quota::where('user_id', $userId)->increment('used_listings');
    }

    /**
     * Get max images allowed per ad for a given subscription.
     */
    public function getMaxImagesPerAd(?Subscription $subscription): int
    {
        if (!$subscription || $subscription->status !== 'active') {
            return 0;
        }

        $plan   = $subscription->plan()->with('features')->first();
        $limits = PlanLimits::fromFeatures($plan?->features ?? collect());

        // 0 means unlimited, return a high number
        return $limits->imageLimit === 0 ? PHP_INT_MAX : $limits->imageLimit;
    }

    /**
     * Check if the user can add X more images to an ad.
     */
    public function canAddImages(Ad $ad, int $incomingCount): bool
    {
        $subscription = $ad->user->subscription;
        $max          = $this->getMaxImagesPerAd($subscription);

        if ($max === 0) {
            return false;
        }

        $current = $ad->images()->count();
        return ($current + $incomingCount) <= $max;
    }

    /**
     * Get a quota summary for a user.
     */
    public function getStatus(int $userId, ?Subscription $subscription): array
    {
        if (!$subscription || $subscription->status !== 'active') {
            return ['allowed' => 0, 'used' => 0, 'remaining' => 0, 'plan_name' => null];
        }

        $plan   = $subscription->plan()->with('features')->first();
        $limits = PlanLimits::fromFeatures($plan?->features ?? collect());
        $quota  = Quota::where('user_id', $userId)->first();
        $used   = $quota?->used_listings ?? $this->countUserAdsThisMonth($userId);
        $max    = $limits->listingLimit === 0 ? PHP_INT_MAX : $limits->listingLimit;

        return [
            'allowed'   => $limits->listingLimit === 0 ? 'unlimited' : $max,
            'used'      => $used,
            'remaining' => $limits->listingLimit === 0 ? 'unlimited' : max($max - $used, 0),
            'plan_name' => $plan?->name,
            'limits'    => $limits->toArray(),
        ];
    }

    /**
     * Count active/pending ads created this month for user.
     */
    public function countUserAdsThisMonth(int $userId): int
    {
        return Ad::where('user_id', $userId)
            ->whereIn('status', ['pending_validation', 'published'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    /**
     * Admin: Reset quota counter for a user.
     */
    public function reset(int $userId, int $planId): void
    {
        Quota::where('user_id', $userId)->update([
            'used_listings' => 0,
            'period_start'  => now(),
        ]);
    }
}

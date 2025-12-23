<?php

namespace App\Domains\Analytics\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Quotas\Services\QuotaService;
use App\Models\User;

class SellerAnalyticsService
{
    public function __construct(
        protected QuotaService $quotaService
    ) {
    }

    public function getDashboard(User $user): array
    {
        return [
            'ads' => $this->adsStats($user->id),
            'quota' => $this->quotaStats($user),
            'subscription' => $this->subscriptionStats($user),
        ];
    }

    protected function adsStats(int $userId): array
    {
        $stats = Ad::where('user_id', $userId)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            'total' => array_sum($stats),
            'draft' => $stats['draft'] ?? 0,
            'pending_validation' => $stats['pending_validation'] ?? 0,
            'published' => $stats['published'] ?? 0,
            'rejected' => $stats['rejected'] ?? 0,
        ];
    }

    protected function quotaStats(User $user): ?array
    {
        if (!$user->subscription) {
            return null;
        }

        $quota = $this->quotaService->check(
            $user->id,
            $user->subscription
        );


        return [
            'plan' => $user->subscription->plan->name,
            'allowed' => $quota['allowed'],
            'used' => $quota['used'],
            'remaining' => $quota['remaining'],
        ];
    }

    protected function subscriptionStats(User $user): ?array
    {
        if (!$user->subscription) {
            return null;
        }

        return [
            'status' => $user->subscription->status,
            'started_at' => $user->subscription->started_at,
            'expires_at' => $user->subscription->expires_at,
        ];
    }
}

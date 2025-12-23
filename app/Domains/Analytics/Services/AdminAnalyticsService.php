<?php

namespace App\Domains\Analytics\Services;

use App\Models\User;
use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Models\Subscription;

class AdminAnalyticsService
{
    public function getDashboard(): array
    {
        return [
            'users' => $this->usersStats(),
            'ads' => $this->adsStats(),
            'subscriptions' => $this->subscriptionsStats(),
        ];
    }

    protected function usersStats(): array
    {
        return [
            'total' => User::count(),
            'sellers' => User::role('seller')->count(),
            'buyers' => User::role('buyer')->count(),
        ];
    }

    protected function adsStats(): array
    {
        $stats = Ad::selectRaw('status, COUNT(*) as total')
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

    protected function subscriptionsStats(): array
    {
        $stats = Subscription::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            'active' => $stats['active'] ?? 0,
            'pending' => $stats['pending'] ?? 0,
            'failed' => $stats['failed'] ?? 0,
        ];
    }
}

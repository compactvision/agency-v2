<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Ads\Resources\AdResource;
use App\Domains\Ads\Services\AdService;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $adService;

    public function __construct(AdService $adService)
    {
        $this->adService = $adService;
    }

    /**
     * Dashboard Home / Overview
     */
    public function index()
    {
        $user = auth()->user();
        $isStaff = $user->hasRole(['admin', 'super-admin']);
        $isBuyer = $user->hasRole('buyer') && ! $isStaff;

        if ($isBuyer) {
            $recentAds = $user->favorites()->with(['category', 'images', 'details', 'user', 'municipality'])->latest()->take(6)->get();
            $totalAds = $user->favorites()->count();
            $unapprovedAds = 0; // Buyers don't have unapproved ads
            $totalViews = 0; // Not applicable for buyers
            $totalFavorites = $totalAds;
        } else {
            // Stats
            $totalAds = $this->adService->count($isStaff ? [] : ['user_id' => $user->id]);
            $unapprovedAds = $this->adService->count($isStaff ? ['status' => 'pending_validation'] : ['user_id' => $user->id, 'status' => 'pending_validation']);

            // Recent Ads
            $recentAds = $this->adService->list([
                'per_page' => 6,
                'user_id' => $isStaff ? null : $user->id,
                'sort_by' => 'created_at',
                'sort_order' => 'desc',
            ]);

            $totalViews = $recentAds->sum('views_count');
            $totalFavorites = 0; // Still placeholder for sellers/admins
        }

        return Inertia::render('dashboard/Index', [
            'properties' => AdResource::collection($isBuyer ? $recentAds : $recentAds->items())->resolve(),
            'isBuyer' => $isBuyer,
            'logs' => [],
            'metrics' => [
                'properties' => [
                    'total' => $totalAds,
                    'unapproved' => $unapprovedAds,
                ],
                'views' => ['total' => $totalViews],
                'favorites' => ['total' => $totalFavorites],
            ],
            'recentNotifications' => $user->notifications()->take(5)->get(),
        ]);
    }
}

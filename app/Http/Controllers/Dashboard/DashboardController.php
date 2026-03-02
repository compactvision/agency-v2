<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Domains\Ads\Services\AdService;
use App\Domains\Ads\Resources\AdResource;

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

        // Stats
        $totalAds = $this->adService->count($isStaff ? [] : ['user_id' => $user->id]);
        $unapprovedAds = $this->adService->count($isStaff ? ['status' => 'pending_validation'] : ['user_id' => $user->id, 'status' => 'pending_validation']);
        
        // Recent Ads
        $recentAds = $this->adService->list([
            'per_page' => 6,
            'user_id' => $isStaff ? null : $user->id,
            'sort_by' => 'created_at',
            'sort_order' => 'desc'
        ]);

        return Inertia::render('dashboard/Index', [
            'properties' => AdResource::collection($recentAds->items())->resolve(),
            'logs' => [],
            'metrics' => [
                'properties' => [
                    'total' => $totalAds,
                    'unapproved' => $unapprovedAds
                ],
                'views' => ['total' => $recentAds->sum('views_count')],
                'favorites' => ['total' => 0], // Assuming favorites count is not yet in AdService or requires separate logic
            ],
            'recentNotifications' => $user->notifications()->take(5)->get(),
        ]);
    }
}

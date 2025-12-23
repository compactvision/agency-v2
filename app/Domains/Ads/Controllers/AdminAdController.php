<?php

namespace App\Domains\Ads\Controllers;

use App\Support\ApiResponse;
use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdService;
use Illuminate\Http\Request;

class AdminAdController
{
    public function __construct(
        protected AdService $service
    ) {}

    public function pending()
    {
        return ApiResponse::success(
            Ad::where('status', 'pending_validation')->get(),
            'Pending ads retrieved'
        );
    }

    public function approve(Ad $ad)
    {
        $ad = $this->service->approve($ad);
        return ApiResponse::success($ad, 'Ad approved');
    }

    public function reject(Request $request, Ad $ad)
    {
        $request->validate([
            'reason' => ['required', 'string']
        ]);

        $ad = $this->service->reject($ad, $request->reason);
        return ApiResponse::success($ad, 'Ad rejected');
    }
}

<?php

namespace App\Domains\Ads\Controllers;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Requests\ApproveAdRequest;
use App\Domains\Ads\Requests\RejectAdRequest;
use App\Domains\Ads\Services\AdService;
use App\Support\ApiResponse;
use Illuminate\Support\Facades\Gate;

class AdminAdController
{
    public function __construct(
        protected AdService $service
    ) {}

    public function pending()
    {
        Gate::authorize('moderate', new Ad);

        return ApiResponse::success(
            Ad::with(['user:id,name,email', 'category:id,name'])
                ->where('status', 'pending_validation')
                ->paginate(25),
            'Pending ads retrieved'
        );
    }

    public function approve(ApproveAdRequest $request, Ad $ad)
    {
        $ad = $this->service->approve($ad);

        return ApiResponse::success($ad, 'Ad approved');
    }

    public function reject(RejectAdRequest $request, Ad $ad)
    {
        $ad = $this->service->reject($ad, $request->reason);

        return ApiResponse::success($ad, 'Ad rejected');
    }
}

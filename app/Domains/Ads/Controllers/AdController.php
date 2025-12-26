<?php

namespace App\Domains\Ads\Controllers;

use App\Support\ApiResponse;
use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdService;
use App\Domains\Ads\Requests\StoreAdRequest;
use App\Domains\Ads\Requests\UpdateAdRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdController
{
    public function __construct(
        protected AdService $service
    ) {}

    public function store(StoreAdRequest $request)
    {
        $ad = $this->service->create(
            $request->validated(),
            Auth::id()
        );

        return ApiResponse::success($ad, 'Ad created');
    }

    public function update(UpdateAdRequest $request, Ad $ad)
    {
        if ($ad->status !== 'draft') {
            return ApiResponse::error("Only draft ads can be updated", 403);
        }

        if ($ad->user_id !== Auth::id()) {
            return ApiResponse::error("Forbidden", 403);
        }

        $result = $this->service->update($ad, $request->validated());

        if ($result['no_changes']) {
            return ApiResponse::success($result['ad'], "No changes detected");
        }

        return ApiResponse::success($result['ad'], "Ad updated");
    }

    public function submit(Ad $ad)
    {
        if ($ad->user_id !== Auth::id()) {
            abort(403);
        }

        $ad = $this->service->submit($ad);

        return ApiResponse::success($ad, 'Ad submitted');
    }

    public function public(Request $request)
    {
        return ApiResponse::success(
            $this->service->publicList($request->all()),
            'Public ads retrieved'
        );
    }

    public function show($id)
    {
        return ApiResponse::success(
            $this->service->getPublicAd($id),
            'Ad details retrieved'
        );
    }
}

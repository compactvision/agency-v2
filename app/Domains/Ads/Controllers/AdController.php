<?php

namespace App\Domains\Ads\Controllers;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Requests\PublicAdFilterRequest;
use App\Domains\Ads\Requests\StoreAdRequest;
use App\Domains\Ads\Requests\SubmitAdRequest;
use App\Domains\Ads\Requests\UpdateAdRequest;
use App\Domains\Ads\Resources\AdResource;
use App\Domains\Ads\Resources\AdSummaryResource;
use App\Domains\Ads\Services\AdService;
use App\Support\ApiResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class AdController
{
    public function __construct(
        protected AdService $service
    ) {}

    public function store(StoreAdRequest $request)
    {
        $ad = $this->service->create(
            $request->validated(),
            $request->user()->id
        );

        return ApiResponse::success(new AdResource($ad), 'Ad created');
    }

    public function update(UpdateAdRequest $request, Ad $ad)
    {
        $result = $this->service->update($ad, $request->validated());

        if ($result['no_changes']) {
            return ApiResponse::success($result['ad'], 'No changes detected');
        }

        return ApiResponse::success(new AdResource($result['ad']), 'Ad updated');
    }

    public function submit(SubmitAdRequest $request, Ad $ad)
    {
        $ad = $this->service->submit($ad);

        return ApiResponse::success(new AdResource($ad), 'Ad submitted');
    }

    public function public(PublicAdFilterRequest $request)
    {
        $ads = $this->service->publicList($request->validated());

        $items = $ads instanceof LengthAwarePaginator
            ? $ads->items()
            : $ads;

        return ApiResponse::success(
            [
                'data' => AdSummaryResource::collection($items)->resolve(),
                'meta' => $ads instanceof LengthAwarePaginator ? [
                    'current_page' => $ads->currentPage(),
                    'last_page' => $ads->lastPage(),
                    'total' => $ads->total(),
                    'per_page' => $ads->perPage(),
                ] : null,
                'links' => $ads instanceof LengthAwarePaginator ? $ads->linkCollection()->toArray() : null,
            ],
            'Public ads retrieved'
        );
    }

    public function show($id)
    {
        $ad = $this->service->getPublicAd($id);

        return ApiResponse::success(
            new AdResource($ad),
            'Ad details retrieved'
        );
    }
}

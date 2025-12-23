<?php

namespace App\Domains\Analytics\Controllers;

use App\Support\ApiResponse;
use App\Domains\Analytics\Services\SellerAnalyticsService;
use Illuminate\Http\Request;

class SellerAnalyticsController
{
    public function __construct(
        protected SellerAnalyticsService $service
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        return ApiResponse::success(
            $this->service->getDashboard($user),
            'Seller analytics retrieved'
        );
    }
}

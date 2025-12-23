<?php

namespace App\Domains\Analytics\Controllers;

use App\Support\ApiResponse;
use App\Domains\Analytics\Services\AdminAnalyticsService;

class AdminAnalyticsController
{
    public function __construct(
        protected AdminAnalyticsService $service
    ) {}

    public function index()
    {
        return ApiResponse::success(
            $this->service->getDashboard(),
            'Admin analytics retrieved'
        );
    }
}

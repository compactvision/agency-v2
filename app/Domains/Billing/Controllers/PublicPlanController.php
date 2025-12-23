<?php

namespace App\Domains\Billing\Controllers;

use App\Domains\Billing\Models\Plan;
use App\Support\ApiResponse;

class PublicPlanController
{
    public function index()
    {
        return ApiResponse::success(
            Plan::with('features')
                ->where('is_active', true)
                ->orderBy('position')
                ->get(),
            "Available plans"
        );
    }
}

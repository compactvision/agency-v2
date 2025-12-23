<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Analytics\Controllers\SellerAnalyticsController;
use App\Domains\Analytics\Controllers\AdminAnalyticsController;

/*
|--------------------------------------------------------------------------
| Analytics Routes
|--------------------------------------------------------------------------
*/

// 🟢 SELLER analytics
Route::middleware(['auth:sanctum', 'maintenance', 'seller'])
    ->prefix('seller')
    ->group(function () {
        Route::get('analytics', [SellerAnalyticsController::class, 'index']);
    });

// 🔴 ADMIN analytics
Route::middleware(['auth:sanctum', 'maintenance', 'admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('analytics', [AdminAnalyticsController::class, 'index']);
    });

<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Ads\Controllers\AdController;
use App\Domains\Ads\Controllers\AdminAdController;
use App\Domains\Ads\Controllers\AdImageController;

Route::prefix('ads')->group(function () {

    // 🌍 PUBLIC
    Route::get('/public', [AdController::class, 'public']);

    // 🟢 SELLER + SUBSCRIPTION ACTIVE
    Route::middleware(['auth:sanctum', 'maintenance', 'seller.active'])->group(function () {

        Route::post('/', [AdController::class, 'store']);
        Route::put('/{ad}', [AdController::class, 'update']);
        Route::post('/{ad}/submit', [AdController::class, 'submit']);

        // Images
        Route::post('{ad}/images', [AdImageController::class, 'store']);
        Route::delete('images/{image}', [AdImageController::class, 'destroy']);
        Route::post('{ad}/images/reorder', [AdImageController::class, 'reorder']);
    });

    // 🔴 ADMIN
    Route::middleware(['auth:sanctum', 'maintenance', 'admin'])->group(function () {
        Route::get('/admin/pending', [AdminAdController::class, 'pending']);
        Route::post('/admin/{ad}/approve', [AdminAdController::class, 'approve']);
        Route::post('/admin/{ad}/reject', [AdminAdController::class, 'reject']);
    });
});

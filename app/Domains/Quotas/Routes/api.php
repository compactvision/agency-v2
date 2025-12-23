<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Quotas\Controllers\QuotaController;

Route::middleware(['auth:sanctum', 'maintenance', 'seller.active'])
    ->prefix('quota')
    ->group(function () {

        Route::get('/status', [QuotaController::class, 'status']);
        Route::post('/consume', [QuotaController::class, 'consume']);

        Route::middleware('admin')->group(function () {
            Route::post('/reset', [QuotaController::class, 'reset']);
        });
    });


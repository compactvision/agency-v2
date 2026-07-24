<?php

use App\Domains\Quotas\Controllers\QuotaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'maintenance', 'seller.active'])
    ->prefix('quota')
    ->group(function () {

        Route::get('/status', [QuotaController::class, 'status']);

        Route::middleware('admin')->group(function () {
            Route::post('/reset', [QuotaController::class, 'reset']);
        });
    });

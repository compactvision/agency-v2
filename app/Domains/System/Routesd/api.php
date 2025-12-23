<?php

use Illuminate\Support\Facades\Route;
use App\Domains\System\Controllers\MaintenanceController;

Route::middleware(['auth:sanctum', 'role:super-admin'])
    ->prefix('system/maintenance')
    ->group(function () {

        Route::get('/', [MaintenanceController::class, 'status']);
        Route::post('/enable', [MaintenanceController::class, 'enable']);
        Route::post('/disable', [MaintenanceController::class, 'disable']);
    });

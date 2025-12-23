<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Amenities\Controllers\AmenityController;

// Public / Seller / Buyer
Route::get('amenities', [AmenityController::class, 'index']);
Route::get('amenities/{id}', [AmenityController::class, 'show']);
// Admin Only
Route::middleware(['auth:sanctum', 'maintenance', 'admin'])
    ->prefix('amenities')
    ->group(function () {

        Route::post('/', [AmenityController::class, 'store']);
        Route::put('/{id}', [AmenityController::class, 'update']);
        Route::delete('/{id}', [AmenityController::class, 'destroy']);

    });

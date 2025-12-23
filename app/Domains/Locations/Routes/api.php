<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Locations\Controllers\CountryController;
use App\Domains\Locations\Controllers\CityController;
use App\Domains\Locations\Controllers\MunicipalityController;

// COUNTRIES (read-only)
Route::get('countries', [CountryController::class, 'index']);
Route::get('countries/{id}', [CountryController::class, 'show']);

// CITIES (read-only)
Route::get('cities', [CityController::class, 'index']);
Route::get('cities/{id}', [CityController::class, 'show']);

// MUNICIPALITIES (read-only)
Route::get('municipalities', [MunicipalityController::class, 'index']);
Route::get('municipalities/{id}', [MunicipalityController::class, 'show']);
Route::middleware(['auth:sanctum', 'maintenance', 'admin'])->group(function () {

    // COUNTRIES
    Route::prefix('countries')->group(function () {
        Route::post('/', [CountryController::class, 'store']);
        Route::put('/{id}', [CountryController::class, 'update']);
        Route::delete('/{id}', [CountryController::class, 'destroy']);
    });

    // CITIES
    Route::prefix('cities')->group(function () {
        Route::post('/', [CityController::class, 'store']);
        Route::put('/{id}', [CityController::class, 'update']);
        Route::delete('/{id}', [CityController::class, 'destroy']);
    });

    // MUNICIPALITIES
    Route::prefix('municipalities')->group(function () {
        Route::post('/', [MunicipalityController::class, 'store']);
        Route::put('/{id}', [MunicipalityController::class, 'update']);
        Route::delete('/{id}', [MunicipalityController::class, 'destroy']);
    });

});


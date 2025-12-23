<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Categories\Controllers\CategoryController;

/*
 * Categories — admin managed
 * Only admin can create/update/delete, everyone can list / show (public)
 */

// Public: list & show
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
// Admin protected (admin middleware must exist)
Route::middleware(['auth:sanctum', 'maintenance', 'admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

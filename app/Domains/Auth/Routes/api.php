<?php

use App\Domains\Auth\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {

    // Public routes
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:5,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Email verification
    Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('api.verification.verify');

    Route::post('email/resend', [AuthController::class, 'resendVerification'])
        ->middleware('auth:sanctum');

    // Password reset
    Route::post('password/forgot', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('password/reset', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);

        // Profile management
        Route::post('profile/update', [AuthController::class, 'updateProfile']);
        Route::post('profile/password', [AuthController::class, 'changePassword']);

        // Upgrade user → seller
        Route::post('become-seller', [AuthController::class, 'becomeSeller']);
    });
});

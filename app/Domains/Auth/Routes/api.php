<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Auth\Controllers\AuthController;

Route::prefix('auth')->group(function () {

    // Public routes
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    // Email verification
    Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->name('verification.verify');

    Route::post('email/resend', [AuthController::class, 'resendVerification'])
        ->middleware('auth:sanctum');

    // Password reset
    Route::post('password/forgot', [AuthController::class, 'forgotPassword']);
    Route::post('password/reset', [AuthController::class, 'resetPassword']);

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

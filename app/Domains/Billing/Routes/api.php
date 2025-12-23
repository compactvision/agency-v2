<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Billing\Controllers\BillingController;
use App\Domains\Billing\Controllers\MockPaymentController;
use App\Domains\Billing\Controllers\PlanController;
use App\Domains\Billing\Webhooks\AcorissWebhookHandler;

// 👇 Public: liste des plans pour le front (pas besoin d’être connecté)
Route::get('plans', [PlanController::class, 'index']);

// 👇 Admin: gestion des plans
Route::middleware(['auth:sanctum', 'maintenance', 'role:admin'])
    ->prefix('plans')
    ->group(function () {
        Route::post('/', [PlanController::class, 'store']);
        Route::get('{id}', [PlanController::class, 'show']);
        Route::put('{id}', [PlanController::class, 'update']);
        Route::delete('{id}', [PlanController::class, 'destroy']);
    });

// 👇 Billing métier (utilisateur connecté)
Route::prefix('billing')
    ->middleware(['auth:sanctum', 'maintenance', 'seller'])
    ->group(function () {

        Route::post('start', [BillingController::class, 'start']);
        Route::get('success', [BillingController::class, 'success'])->name('billing.success');
        Route::get('cancel', [BillingController::class, 'cancel'])->name('billing.cancel');
        Route::get('current', [BillingController::class, 'current']);
    });


// Webhook (appelé par Acoriss)
Route::post('webhooks/acoriss', AcorissWebhookHandler::class)
    ->name('webhooks.acoriss');

// Mock local (utilisé seulement en local)
Route::prefix('mock')->group(function () {
    Route::post('checkout/create-session', [MockPaymentController::class, 'createSession']);
    Route::get('payment/{sessionId}', [MockPaymentController::class, 'getPayment']);
    Route::post('webhook', [MockPaymentController::class, 'webhook']);
});

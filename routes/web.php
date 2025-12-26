<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\PageController;
use App\Http\Controllers\DashboardController;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/tarifs', [PageController::class, 'tarifs'])->name('tarifs');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/properties', [PageController::class, 'properties'])->name('properties');
Route::get('/property/{slug}', [PageController::class, 'property'])->name('property.show');
Route::get('pages/{slug}', [PageController::class, 'page'])->name('pages.show');
Route::post('/language', [PageController::class, 'language'])->name('language');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/subscriptions/check-access', [\App\Domains\Billing\Controllers\BillingController::class, 'start'])->name('subscriptions.checkAccess');
    Route::get('/profile', [PageController::class, 'profile'])->name('profile');
    Route::post('/become-seller', \App\Http\Controllers\Auth\BecomeSellerController::class)->name('become-seller');
});

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('/dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    // Properties
    Route::prefix('properties')->name('properties.')->group(function () {
        Route::get('/', [DashboardController::class, 'properties'])->name('index');
        Route::get('/create', [DashboardController::class, 'createProperty'])->name('create');
        Route::get('/{id}/edit', [DashboardController::class, 'editProperty'])->name('edit');
        Route::get('/favorites', [DashboardController::class, 'favorites'])->name('favorites');
    });

    // Users & Roles
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [DashboardController::class, 'users'])->name('index');
        Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
    });
    Route::get('/roles', [DashboardController::class, 'roles'])->name('roles.index');

    // Admin Tools
    Route::get('/municipalities', [DashboardController::class, 'municipalities'])->name('municipalities.index');
    Route::get('/plans', [DashboardController::class, 'plans'])->name('plans.index');
    Route::get('/pages', [DashboardController::class, 'pages'])->name('pages.index');
    Route::get('/pages/{id}/edit', [DashboardController::class, 'editPage'])->name('pages.edit');
    Route::get('/payment-requests', [DashboardController::class, 'transactions'])->name('payment-requests.index');
    Route::get('/audit-logs', [DashboardController::class, 'auditLogs'])->name('audit-logs.index');
    Route::get('/chatbot-logs', [DashboardController::class, 'chatbotLogs'])->name('chatbot-logs.index');

    // Settings & Others
    Route::get('/settings', [DashboardController::class, 'settings'])->name('settings');
    Route::get('/subscriptions', [DashboardController::class, 'subscriptions'])->name('subscriptions.index');
    Route::get('/analytics', [DashboardController::class, 'analytics'])->name('analytics.index');
    Route::get('/analytics/{id}', [DashboardController::class, 'showAnalytics'])->name('analytics.show');
});



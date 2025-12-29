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

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('/dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::name('dashboard.')->group(function () {

    // Properties
    Route::prefix('properties')->name('properties.')->group(function () {
        Route::get('/', [DashboardController::class, 'properties'])->name('index');
        Route::get('/create', [DashboardController::class, 'createProperty'])->name('create');
        Route::post('/store', [DashboardController::class, 'storeProperty'])->name('store');
        Route::get('/favorites', [DashboardController::class, 'favorites'])->name('favorites');
        Route::post('/{id}/favorite', [DashboardController::class, 'toggleFavorite'])->name('favorite');
        Route::get('/{id}', [DashboardController::class, 'showProperty'])->name('show');
        Route::get('/{id}/edit', [DashboardController::class, 'editProperty'])->name('edit');
        Route::put('/{id}/update', [DashboardController::class, 'updateProperty'])->name('update');
        Route::patch('/{id}/approve', [DashboardController::class, 'approveProperty'])->name('approve');
    });

    // Users & Roles
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [DashboardController::class, 'users'])->name('index');
        Route::post('/', [DashboardController::class, 'storeUser'])->name('store');
        Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
        Route::put('/{id}', [DashboardController::class, 'updateUser'])->name('update');
        Route::delete('/{id}', [DashboardController::class, 'destroyUser'])->name('destroy');
    });
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [DashboardController::class, 'roles'])->name('index');
        Route::post('/', [DashboardController::class, 'storeRole'])->name('store');
        Route::put('/{id}', [DashboardController::class, 'updateRole'])->name('update');
        Route::delete('/{id}', [DashboardController::class, 'destroyRole'])->name('destroy');
    });

    // Admin Tools
    Route::get('/municipalities', [DashboardController::class, 'municipalities'])->name('municipalities.index');
    Route::get('/plans', [DashboardController::class, 'plans'])->name('plans.index');
    Route::post('/plans', [DashboardController::class, 'storePlan'])->name('plans.store');
    Route::put('/plans/{id}', [DashboardController::class, 'updatePlan'])->name('plans.update');
    Route::delete('/plans/{id}', [DashboardController::class, 'destroyPlan'])->name('plans.destroy');
    Route::get('/pages', [DashboardController::class, 'pages'])->name('pages.index');
    Route::get('/pages/create', [DashboardController::class, 'createPage'])->name('pages.create');
    Route::post('/pages', [DashboardController::class, 'storePage'])->name('pages.store');
    Route::get('/pages/{id}/edit', [DashboardController::class, 'editPage'])->name('pages.edit');
    Route::put('/pages/{id}', [DashboardController::class, 'updatePage'])->name('pages.update');
    Route::delete('/pages/{id}', [DashboardController::class, 'destroyPage'])->name('pages.destroy');
    Route::get('/payment-requests', [DashboardController::class, 'transactions'])->name('payment-requests.index');
    Route::post('/payment-requests/store', [DashboardController::class, 'storePaymentRequest'])->name('payment-requests.store');
    Route::put('/payment-requests/{id}/approve', [DashboardController::class, 'approvePaymentRequest'])->name('payment-requests.approve');
    Route::put('/payment-requests/{id}/reject', [DashboardController::class, 'rejectPaymentRequest'])->name('payment-requests.reject');
    Route::get('/audit-logs', [DashboardController::class, 'auditLogs'])->name('audit-logs.index');
    Route::get('/chatbot-logs', [DashboardController::class, 'chatbotLogs'])->name('chatbot-logs.index');

    // Favorites dedicated routes for the dashboard component
    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::get('/', [DashboardController::class, 'favorites'])->name('index');
        Route::delete('/{id}', [DashboardController::class, 'toggleFavorite'])->name('destroy');
    });

    // Settings & Others
    Route::get('/settings', [DashboardController::class, 'settings'])->name('settings');
    Route::get('/subscriptions', [DashboardController::class, 'subscriptions'])->name('subscriptions.index');
    Route::get('/analytics', [DashboardController::class, 'analytics'])->name('analytics.index');
    Route::get('/analytics/{id}', [DashboardController::class, 'showAnalytics'])->name('analytics.show');

    // Notifications
    Route::get('/notifications', [DashboardController::class, 'notifications'])->name('notifications');
    Route::post('/notifications/mark-all-read', [DashboardController::class, 'markAllNotificationsAsRead'])->name('notifications.mark-all-read');
    Route::post('/notifications/{id}/mark-read', [DashboardController::class, 'markNotificationAsRead'])->name('notifications.mark-read');
    });
});



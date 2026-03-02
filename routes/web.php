<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\PageController as FrontPageController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\PropertyController;
use App\Http\Controllers\Dashboard\UserController;
use App\Http\Controllers\Dashboard\RoleController;
use App\Http\Controllers\Dashboard\PlanController;
use App\Http\Controllers\Dashboard\MunicipalityController;
use App\Http\Controllers\Dashboard\PageController as AdminPageController;
use App\Http\Controllers\Dashboard\TransactionController;
use App\Http\Controllers\Dashboard\LogController;
use App\Http\Controllers\Dashboard\SettingController;
use App\Http\Controllers\Dashboard\SubscriptionController;
use App\Http\Controllers\Dashboard\AnalyticsController;
use App\Http\Controllers\Dashboard\NotificationController;

Route::get('/', [FrontPageController::class, 'home'])->name('home');
Route::get('/about', [FrontPageController::class, 'about'])->name('about');
Route::get('/contact', [FrontPageController::class, 'contact'])->name('contact');
Route::get('/tarifs', [FrontPageController::class, 'tarifs'])->name('tarifs');
Route::get('/faq', [FrontPageController::class, 'faq'])->name('faq');
Route::get('/properties', [FrontPageController::class, 'properties'])->name('properties');
Route::get('/property/{slug}', [FrontPageController::class, 'property'])->name('property.show');
Route::get('pages/{slug}', [FrontPageController::class, 'page'])->name('pages.show');
Route::post('/language', [FrontPageController::class, 'language'])->name('language');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/subscriptions/check-access', [\App\Domains\Billing\Controllers\BillingController::class, 'start'])->name('subscriptions.checkAccess');
    Route::get('/profile', [FrontPageController::class, 'profile'])->name('profile');
    Route::post('/become-seller', \App\Http\Controllers\Auth\BecomeSellerController::class)->name('become-seller');
});

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('/dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::name('dashboard.')->group(function () {

    // Properties
    Route::prefix('properties')->name('properties.')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('index');
        Route::get('/create', [PropertyController::class, 'create'])->name('create');
        Route::post('/store', [PropertyController::class, 'store'])->name('store');
        Route::get('/favorites', [PropertyController::class, 'favorites'])->name('favorites');
        Route::post('/{id}/favorite', [PropertyController::class, 'toggleFavorite'])->name('favorite');
        Route::get('/{id}', [PropertyController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [PropertyController::class, 'edit'])->name('edit');
        Route::put('/{id}/update', [PropertyController::class, 'update'])->name('update');
        Route::patch('/{id}/approve', [PropertyController::class, 'approve'])->name('approve');
    });

    // Users & Roles
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/profile', [UserController::class, 'profile'])->name('profile');
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::put('/{id}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{id}', [RoleController::class, 'destroy'])->name('destroy');
    });

    // Admin Tools
    Route::get('/municipalities', [MunicipalityController::class, 'index'])->name('municipalities.index');
    Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');
    Route::post('/plans', [PlanController::class, 'store'])->name('plans.store');
    Route::put('/plans/{id}', [PlanController::class, 'update'])->name('plans.update');
    Route::delete('/plans/{id}', [PlanController::class, 'destroy'])->name('plans.destroy');
    
    Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
    Route::get('/pages/create', [AdminPageController::class, 'create'])->name('pages.create');
    Route::post('/pages', [AdminPageController::class, 'store'])->name('pages.store');
    Route::get('/pages/{id}/edit', [AdminPageController::class, 'edit'])->name('pages.edit');
    Route::put('/pages/{id}', [AdminPageController::class, 'update'])->name('pages.update');
    Route::delete('/pages/{id}', [AdminPageController::class, 'destroy'])->name('pages.destroy');
    
    Route::get('/payment-requests', [TransactionController::class, 'index'])->name('payment-requests.index');
    Route::post('/payment-requests/store', [TransactionController::class, 'store'])->name('payment-requests.store');
    Route::put('/payment-requests/{id}/approve', [TransactionController::class, 'approve'])->name('payment-requests.approve');
    Route::put('/payment-requests/{id}/reject', [TransactionController::class, 'reject'])->name('payment-requests.reject');
    
    Route::get('/audit-logs', [LogController::class, 'auditLogs'])->name('audit-logs.index');
    Route::get('/chatbot-logs', [LogController::class, 'chatbotLogs'])->name('chatbot-logs.index');

    // Favorites dedicated routes for the dashboard component
    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::get('/', [PropertyController::class, 'favorites'])->name('index');
        Route::delete('/{id}', [PropertyController::class, 'toggleFavorite'])->name('destroy');
    });

    // Settings & Others
    Route::get('/settings', [SettingController::class, 'index'])->name('settings');
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/analytics/{id}', [AnalyticsController::class, 'show'])->name('analytics.show');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    });
});

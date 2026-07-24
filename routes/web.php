<?php

use App\Domains\Billing\Controllers\BillingController;
use App\Http\Controllers\Auth\BecomeSellerController;
use App\Http\Controllers\Dashboard\AmenityController;
use App\Http\Controllers\Dashboard\AnalyticsController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\LogController;
use App\Http\Controllers\Dashboard\MunicipalityController;
use App\Http\Controllers\Dashboard\NotificationController;
use App\Http\Controllers\Dashboard\PageController as AdminPageController;
use App\Http\Controllers\Dashboard\PlanController;
use App\Http\Controllers\Dashboard\PropertyController;
use App\Http\Controllers\Dashboard\PropertyDescriptionController;
use App\Http\Controllers\Dashboard\RoleController;
use App\Http\Controllers\Dashboard\SettingController;
use App\Http\Controllers\Dashboard\SubscriptionController;
use App\Http\Controllers\Dashboard\TransactionController;
use App\Http\Controllers\Dashboard\UserController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PageController as FrontPageController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

Route::get('/', [FrontPageController::class, 'home'])->name('home');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/about', [FrontPageController::class, 'about'])->name('about');
Route::get('/contact', [FrontPageController::class, 'contact'])->name('contact');
Route::post('/contact', [FrontPageController::class, 'contactSend'])->middleware('throttle:5,1')->name('contact.send');
Route::get('/tarifs', [FrontPageController::class, 'tarifs'])->name('tarifs');
Route::get('/faq', [FrontPageController::class, 'faq'])->name('faq');
Route::get('/properties', [FrontPageController::class, 'properties'])->name('properties');
Route::get('/properties/{ad:slug}', [FrontPageController::class, 'property'])->name('property.show');
Route::get('/property/{id}', [FrontPageController::class, 'legacyProperty'])
    ->whereNumber('id')
    ->name('property.legacy');
Route::get('pages/{slug}', [FrontPageController::class, 'page'])->name('pages.show');
Route::post('/language', [FrontPageController::class, 'language'])->middleware('throttle:30,1')->name('language');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/properties/{ad:slug}/contact-owner', [FrontPageController::class, 'contactOwner'])
        ->middleware('throttle:5,1')
        ->name('contact.owner');
    Route::post('/subscriptions/check-access', [BillingController::class, 'start'])
        ->middleware('throttle:5,1')
        ->name('subscriptions.checkAccess');
    Route::get('/profile', [FrontPageController::class, 'profile'])->name('profile');
    Route::post('/become-seller', BecomeSellerController::class)->name('become-seller');

    if (app()->environment('local')) {
        Route::get('/demo-gateway', function () {
            return Inertia::render('demo/DemoGateway', [
                'transactionId' => request('transactionId', 'demo_'.Str::random(8)),
            ]);
        })->name('demo.gateway');
    }
});

require __DIR__.'/settings.php';

Route::middleware(['auth', 'verified'])->prefix('/dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/properties/generate-description', [PropertyDescriptionController::class, 'generate'])
        ->name('description.ai.generate-description');

    Route::name('dashboard.')->group(function () {

        // Properties
        Route::prefix('properties')->name('properties.')->group(function () {
            Route::get('/', [PropertyController::class, 'index'])->name('index');
            Route::get('/validation', [PropertyController::class, 'validation'])->name('validation');
            Route::get('/create', [PropertyController::class, 'create'])->name('create');
            Route::post('/store', [PropertyController::class, 'store'])->name('store');
            Route::get('/favorites', [PropertyController::class, 'favorites'])->name('favorites');
            Route::post('/{id}/favorite', [PropertyController::class, 'toggleFavorite'])->name('favorite');
            Route::get('/{id}', [PropertyController::class, 'show'])->name('show');
            Route::get('/{id}/edit', [PropertyController::class, 'edit'])->name('edit');
            Route::put('/{id}/update', [PropertyController::class, 'update'])->name('update');
            Route::get('/validation/{id}', [PropertyController::class, 'validationShow'])->name('validation.show');
            Route::patch('/{id}/approve', [PropertyController::class, 'approve'])->name('approve');
            Route::put('/{id}/reject', [PropertyController::class, 'reject'])->name('reject');
        });

        // Personal Routes (accessible to all roles in dashboard)
        // User Profile
        Route::get('/profile', [UserController::class, 'profile'])->name('users.profile');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings');
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('/analytics/{id}', [AnalyticsController::class, 'show'])->name('analytics.show');

        // Users & Roles (Admin Only)
        Route::middleware('admin')->group(function () {
            Route::prefix('users')->name('users.')->group(function () {
                Route::get('/', [UserController::class, 'index'])->name('index');
                Route::post('/', [UserController::class, 'store'])->name('store');
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
            Route::delete('/audit-logs/purge', [LogController::class, 'purge'])->name('audit-logs.purge');
            Route::get('/chatbot-logs', [LogController::class, 'chatbotLogs'])->name('chatbot-logs.index');

            Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
            Route::resource('amenities', AmenityController::class)->except(['create', 'edit', 'show']);

            Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
        });

        // Favorites dedicated routes for the dashboard component
        Route::prefix('favorites')->name('favorites.')->group(function () {
            Route::get('/', [PropertyController::class, 'favorites'])->name('index');
            Route::delete('/{id}', [PropertyController::class, 'toggleFavorite'])->name('destroy');
        });

        // Subscriptions
        Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
        Route::post('/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    });
});
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->middleware('throttle:5,1')->name('newsletter.subscribe');

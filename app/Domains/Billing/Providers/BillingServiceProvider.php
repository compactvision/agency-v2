<?php

namespace App\Domains\Billing\Providers;

use App\Domains\Billing\Domain\Events\ManualSubscriptionRequested;
use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Domain\Events\SubscriptionExpired;
use App\Domains\Billing\Infrastructure\Gateways\Contracts\PaymentGatewayInterface;
use App\Domains\Billing\Infrastructure\Listeners\NotifyAdminOfManualRequest;
use App\Domains\Billing\Infrastructure\Listeners\SendSubscriptionActivatedMail;
use App\Domains\Billing\Infrastructure\Listeners\SendSubscriptionExpiredMail;
use App\Domains\Billing\Services\PaymentGatewayService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind the PaymentGatewayInterface to the unified PaymentGatewayService
        // (which handles Mock vs Acoriss internally based on environment)
        $this->app->bind(PaymentGatewayInterface::class, function () {
            return app(PaymentGatewayService::class);
        });
    }

    public function boot(): void
    {
        $this->loadRoutes();
        $this->registerEventListeners();
    }

    private function loadRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(function () {
                require base_path('app/Domains/Billing/Routes/api.php');
            });
    }

    private function registerEventListeners(): void
    {
        Event::listen(SubscriptionActivated::class, SendSubscriptionActivatedMail::class);
        Event::listen(SubscriptionExpired::class, SendSubscriptionExpiredMail::class);
        Event::listen(ManualSubscriptionRequested::class, NotifyAdminOfManualRequest::class);
    }
}

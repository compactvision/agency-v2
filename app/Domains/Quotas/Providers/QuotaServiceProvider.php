<?php

namespace App\Domains\Quotas\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class QuotaServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(function () {
                require base_path('app/Domains/Quotas/Routes/api.php');
            });
    }
}

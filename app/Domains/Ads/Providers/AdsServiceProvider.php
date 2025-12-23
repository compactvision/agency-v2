<?php

namespace App\Domains\Ads\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AdsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(function () {
                require base_path('app/Domains/Ads/Routes/api.php');
            });
    }
}

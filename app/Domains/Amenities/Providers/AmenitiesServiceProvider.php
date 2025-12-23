<?php

namespace App\Domains\Amenities\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AmenitiesServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(function () {
                require base_path('app/Domains/Amenities/Routes/api.php');
            });
    }
}

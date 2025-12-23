<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\FortifyServiceProvider::class,
    App\Domains\Locations\Providers\LocationsServiceProvider::class,
    App\Domains\Auth\Providers\AuthServiceProvider::class,
    App\Domains\Billing\Providers\BillingServiceProvider::class,
    App\Domains\Quotas\Providers\QuotaServiceProvider::class,
    App\Domains\Categories\Providers\CategoriesServiceProvider::class,
    App\Domains\Amenities\Providers\AmenitiesServiceProvider::class,
    App\Domains\Ads\Providers\AdsServiceProvider::class,
    App\Domains\Analytics\Providers\AnalyticsServiceProvider::class,
    App\Domains\System\Providers\SystemServiceProvider::class,
];

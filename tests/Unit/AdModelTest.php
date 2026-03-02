<?php

namespace Tests\Unit;

use App\Domains\Ads\Models\Ad;
use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Tests\TestCase;

class AdModelTest extends TestCase
{
    public function test_it_has_municipality_relationship()
    {
        $ad = new Ad();
        $this->assertInstanceOf(BelongsTo::class, $ad->municipality());
        $this->assertInstanceOf(Municipality::class, $ad->municipality()->getRelated());
    }

    public function test_it_has_city_relationship()
    {
        $ad = new Ad();
        $this->assertInstanceOf(BelongsTo::class, $ad->city());
        $this->assertInstanceOf(City::class, $ad->city()->getRelated());
    }

    public function test_it_has_country_relationship()
    {
        $ad = new Ad();
        $this->assertInstanceOf(BelongsTo::class, $ad->country());
        $this->assertInstanceOf(Country::class, $ad->country()->getRelated());
    }
}

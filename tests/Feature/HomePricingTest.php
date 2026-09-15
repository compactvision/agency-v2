<?php

use App\Domains\Billing\Models\Plan;
use Inertia\Testing\AssertableInertia as Assert;

it('shows active plans with features in display order on the landing page', function () {
    $second = Plan::create(['name' => 'Pro', 'price' => 25, 'is_active' => true, 'position' => 2]);
    $first = Plan::create(['name' => 'Starter', 'price' => 10, 'is_active' => true, 'position' => 1]);
    $first->features()->create(['name' => 'Publication des annonces', 'value' => '5']);
    Plan::create(['name' => 'Hidden', 'price' => 50, 'is_active' => false]);

    $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('Home')
        ->has('plans', 2)
        ->where('plans.0.id', $first->id)
        ->where('plans.1.id', $second->id)
        ->where('plans.0.features.0.name', 'Publication des annonces')
        ->where('currentPlanId', null)
    );
});

it('keeps the landing page accessible without active plans', function () {
    $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('Home')
        ->has('plans', 0)
    );
});

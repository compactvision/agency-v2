<?php

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/** Explicit paid fixture for tests exercising public listings. */
function grantTestPublicationRights(User $user, string $limit = 'Unlimited'): Subscription
{
    $plan = Plan::create(['name' => 'Test paid plan', 'price' => 25, 'interval' => 'monthly', 'payment_method' => 'manual', 'is_active' => true]);
    $plan->features()->createMany([['name' => 'Listings per month', 'value' => $limit], ['name' => 'Images per ad', 'value' => 'Unlimited']]);

    return Subscription::create([
        'user_id' => $user->id, 'plan_id' => $plan->id, 'transaction_id' => (string) Str::uuid(),
        'payment_id' => (string) Str::uuid(), 'status' => 'active', 'amount' => 25,
        'currency' => 'USD', 'started_at' => now()->subDay(), 'expires_at' => now()->addMonth(),
    ]);
}

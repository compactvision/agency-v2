<?php

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function manualSubscriptionPlan(): Plan
{
    return Plan::create([
        'name' => 'Plan vendeur',
        'description' => 'Plan de test',
        'price' => 25,
        'payment_method' => 'manual',
        'interval' => 'monthly',
        'is_active' => true,
        'position' => 1,
    ]);
}

test('a seller can request a manual subscription', function () {
    $seller = User::factory()->create();
    $seller->assignRole('seller');
    $plan = manualSubscriptionPlan();

    $response = $this->actingAs($seller)
        ->from(route('dashboard.subscriptions.index'))
        ->post(route('dashboard.subscriptions.store'), [
            'plan_id' => $plan->id,
            'phone_number' => '853621283',
            'type' => 'new',
        ]);

    $response
        ->assertRedirect(route('dashboard.subscriptions.index'))
        ->assertSessionHas('success', 'Votre demande a été envoyée avec succès.');

    expect(Subscription::query()
        ->where('user_id', $seller->id)
        ->where('plan_id', $plan->id)
        ->where('status', 'pending')
        ->exists())->toBeTrue();
});

test('a buyer cannot create a seller subscription request', function () {
    $buyer = User::factory()->create();
    $buyer->assignRole('buyer');
    $plan = manualSubscriptionPlan();

    $this->actingAs($buyer)
        ->post(route('dashboard.subscriptions.store'), [
            'plan_id' => $plan->id,
            'phone_number' => '853621283',
            'type' => 'new',
        ])
        ->assertForbidden();

    expect(Subscription::where('user_id', $buyer->id)->exists())->toBeFalse();
});

test('seller subscription access does not grant payment approval rights', function () {
    $seller = User::factory()->create();
    $seller->assignRole('seller');
    $plan = manualSubscriptionPlan();
    $subscription = Subscription::create([
        'user_id' => $seller->id,
        'plan_id' => $plan->id,
        'transaction_id' => 'pending-request',
        'status' => 'pending',
        'amount' => $plan->price,
        'currency' => 'USD',
    ]);

    $this->actingAs($seller)
        ->put(route('dashboard.payment-requests.approve', $subscription))
        ->assertForbidden();

    expect($subscription->fresh()->status)->toBe('pending');
});

test('seller sees the selected plan duration and subscription dates', function () {
    $seller = User::factory()->create();
    $seller->assignRole('seller');
    $plan = manualSubscriptionPlan();
    $startedAt = now()->startOfSecond();
    $expiresAt = $startedAt->copy()->addMonth();

    Subscription::create([
        'user_id' => $seller->id,
        'plan_id' => $plan->id,
        'plan_name' => $plan->name,
        'plan_interval' => $plan->interval,
        'transaction_id' => 'active-subscription',
        'status' => 'active',
        'amount' => $plan->price,
        'currency' => 'USD',
        'interval' => $plan->interval,
        'started_at' => $startedAt,
        'expires_at' => $expiresAt,
    ]);

    $this->actingAs($seller)
        ->get(route('dashboard.subscriptions.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/subscriptions/Package')
            ->where('subscriptions.data.0.plan.name', 'Plan vendeur')
            ->where('subscriptions.data.0.plan.interval', 'monthly')
            ->where('subscriptions.data.0.started_at', $startedAt->toIso8601String())
            ->where('subscriptions.data.0.expires_at', $expiresAt->toIso8601String())
            ->where('plans.0.duration', 'monthly')
        );
});

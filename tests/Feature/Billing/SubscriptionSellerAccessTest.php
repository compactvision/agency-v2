<?php

use App\Domains\Billing\Models\Plan;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    Http::preventStrayRequests();
    $this->buyer = User::factory()->create();
    $this->buyer->assignRole('buyer');
    $this->plan = Plan::create([
        'name' => 'Seller plan', 'price' => 25, 'is_active' => true,
        'payment_method' => 'manual', 'interval' => 'monthly',
    ]);
});

it('blocks buyers from subscribing through public pricing', function () {
    $this->actingAs($this->buyer)
        ->postJson(route('subscriptions.checkAccess'), ['plan_id' => $this->plan->id])
        ->assertForbidden()
        ->assertJsonPath('error_code', 'SELLER_REQUIRED')
        ->assertJsonPath('message', 'Vous devez d’abord devenir vendeur pour pouvoir souscrire un abonnement.');

    $this->assertDatabaseCount('subscriptions', 0);
    Http::assertNothingSent();
});

it('blocks buyers from requesting a dashboard subscription even with permission', function () {
    $this->buyer->givePermissionTo('subscription.create');
    $this->actingAs($this->buyer)
        ->postJson(route('dashboard.subscriptions.store'), [
            'plan_id' => $this->plan->id, 'type' => 'new',
        ])->assertForbidden();

    $this->assertDatabaseCount('subscriptions', 0);
    Http::assertNothingSent();
});

it('allows a buyer to subscribe after becoming a seller', function () {
    $this->buyer->assignRole('seller');
    $this->actingAs($this->buyer)
        ->postJson(route('subscriptions.checkAccess'), ['plan_id' => $this->plan->id])
        ->assertCreated()
        ->assertJsonPath('data.status', 'manual_pending');

    $this->assertDatabaseHas('subscriptions', [
        'user_id' => $this->buyer->id, 'plan_id' => $this->plan->id,
    ]);
    Http::assertNothingSent();
});

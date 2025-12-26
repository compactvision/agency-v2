<?php

namespace Tests\Feature;

use App\Models\User;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionCheckTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup Plan
        Plan::create([
             'id' => 1,
             'name' => 'Basic Plan',
             'slug' => 'basic',
             'stripe_price_id' => 'price_123',
             'price' => 1000,
             'interval' => 'month',
             'description' => 'Test plan'
        ]);

        // Setup Category
        \App\Domains\Categories\Models\Category::create([
            'id' => 1,
            'name' => 'House',
            'slug' => 'house',
            'type' => 'property'
        ]);
    }

    public function test_user_without_subscription_sees_false_status()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('dashboard.properties.create'));

        $response->assertStatus(200);
        
        $page = $response->viewData('page');
        $this->assertFalse($page['props']['hasActiveSubscription']);
    }

    public function test_user_with_active_subscription_sees_true_status()
    {
        $user = User::factory()->create();
        Subscription::create([
            'user_id' => $user->id,
            'plan_id' => 1,
            'stripe_id' => 'sub_123',
            'stripe_status' => 'active',
            'status' => 'active',
            'ends_at' => now()->addMonth(),
            'transaction_id' => 'tx_123',
            'amount' => 1000, // Added
        ]);

        $response = $this->actingAs($user)
            ->get(route('dashboard.properties.create'));

        $response->assertStatus(200);
        
        $page = $response->viewData('page');
        $this->assertTrue($page['props']['hasActiveSubscription']);
    }

    public function test_user_without_subscription_can_create_draft()
    {
        $user = User::factory()->create();

        $data = [
            'category_id' => 1,
            'ad_type' => 'sale',
            'title' => 'Test Property',
            'description' => 'Description',
            'price' => 100000,
            'is_published' => false,
            'details' => [
                'bedrooms' => 2,
                'bathrooms' => 1,
                'kitchens' => 1,
            ],
            'municipality_id' => null,
        ];

        $response = $this->actingAs($user)
            ->post(route('dashboard.properties.store'), $data);

        $response->assertRedirect(route('dashboard.properties.index'));
        $this->assertDatabaseHas('ads', [
            'user_id' => $user->id,
            'title' => 'Test Property',
            'status' => 'draft',
            'is_published' => 0,
        ]);
    }
}

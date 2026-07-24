<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Models\AdImage;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\SubscriptionManager;
use App\Domains\Categories\Models\Category;
use App\Models\User;
use App\Support\UserAnonymizer;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

test('a subscription keeps its commercial snapshot when its plan changes or is archived', function () {
    $user = User::factory()->create();
    $plan = Plan::create([
        'name' => 'Pro historique',
        'price' => 75,
        'interval' => 'yearly',
        'is_active' => true,
    ]);
    $plan->features()->create(['name' => 'listing_limit', 'value' => '25']);

    $subscription = app(SubscriptionManager::class)->createPending($user->id, $plan);

    $plan->update(['name' => 'Nouveau nom', 'price' => 100]);
    $plan->delete();

    expect($subscription->fresh())
        ->plan_name->toBe('Pro historique')
        ->plan_interval->toBe('yearly')
        ->amount->toBe('75.00')
        ->and($subscription->fresh()->plan_features)->toBe([
            ['name' => 'listing_limit', 'value' => '25'],
        ])
        ->and(Subscription::count())->toBe(1)
        ->and($subscription->fresh()->plan?->trashed())->toBeTrue();
});

test('anonymizing a user archives ads while preserving subscriptions and media records', function () {
    Storage::fake('public');
    Storage::disk('public')->put('profile-photos/private.jpg', 'avatar');
    Storage::disk('public')->put('ads/property.jpg', 'property');

    $user = User::factory()->create([
        'phone' => '+243000000000',
        'profile_photo' => 'profile-photos/private.jpg',
        'address' => 'Adresse privée',
        'company' => 'Entreprise privée',
    ]);
    $plan = Plan::create([
        'name' => 'Archive',
        'price' => 20,
        'interval' => 'monthly',
        'is_active' => true,
    ]);
    $subscription = Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'plan_name' => $plan->name,
        'plan_interval' => $plan->interval,
        'transaction_id' => 'history-before-anonymization',
        'status' => 'active',
        'amount' => 20,
        'currency' => 'USD',
        'started_at' => now(),
        'expires_at' => now()->addMonth(),
    ]);
    $category = Category::create(['name' => 'Maison archive', 'slug' => 'maison-archive']);
    $ad = Ad::create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'AD-ARCHIVE',
        'title' => 'Bien à conserver',
        'price' => 100,
        'status' => 'published',
        'is_published' => true,
        'is_approved' => true,
    ]);
    $image = AdImage::create([
        'ad_id' => $ad->id,
        'path' => 'ads/property.jpg',
        'position' => 1,
    ]);

    expect(app(UserAnonymizer::class)->anonymize($user))->toBeTrue();

    $anonymized = $user->fresh();
    expect($anonymized)
        ->anonymized_at->not->toBeNull()
        ->phone->toBeNull()
        ->address->toBeNull()
        ->company->toBeNull()
        ->and(Subscription::find($subscription->id))->not->toBeNull()
        ->and(Ad::find($ad->id))->toBeNull()
        ->and(Ad::withTrashed()->find($ad->id)?->status)->toBe('archived')
        ->and(AdImage::find($image->id))->not->toBeNull();

    Storage::disk('public')->assertMissing('profile-photos/private.jpg');
    Storage::disk('public')->assertExists('ads/property.jpg');
});

test('database constraints prevent physical deletion of business owners', function () {
    $user = User::factory()->create();
    $plan = Plan::create([
        'name' => 'Protégé',
        'price' => 10,
        'interval' => 'monthly',
        'is_active' => true,
    ]);
    Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'transaction_id' => 'protected-history',
        'status' => 'pending',
        'amount' => 10,
        'currency' => 'USD',
    ]);

    expect(fn () => DB::table('users')->where('id', $user->id)->delete())
        ->toThrow(QueryException::class)
        ->and(fn () => DB::table('plans')->where('id', $plan->id)->delete())
        ->toThrow(QueryException::class);

    expect(Subscription::where('transaction_id', 'protected-history')->exists())->toBeTrue();
});

test('a newer pending checkout does not hide an active subscription', function () {
    $user = User::factory()->create();
    $plan = Plan::create([
        'name' => 'Actif',
        'price' => 10,
        'interval' => 'monthly',
        'is_active' => true,
    ]);
    Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'transaction_id' => 'active-first',
        'status' => 'active',
        'amount' => 10,
        'currency' => 'USD',
        'expires_at' => now()->addMonth(),
    ]);
    Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'transaction_id' => 'pending-second',
        'status' => 'pending',
        'amount' => 10,
        'currency' => 'USD',
    ]);

    expect($user->fresh()->hasActiveSubscription())->toBeTrue()
        ->and($user->fresh()->subscription?->transaction_id)->toBe('active-first')
        ->and($user->fresh()->subscriptions()->count())->toBe(2);
});

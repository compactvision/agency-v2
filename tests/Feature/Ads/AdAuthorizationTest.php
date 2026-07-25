<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Mail\PropertyApprovedMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

function createAuthorizedTestAd(User $owner, string $status = 'draft'): Ad
{
    $category = Category::create([
        'name' => 'Authorization category '.fake()->uuid(),
        'slug' => fake()->uuid(),
    ]);

    return Ad::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'AUTH-'.fake()->unique()->numerify('########'),
        'title' => 'Private property',
        'price' => 100,
        'currency' => 'USD',
        'status' => $status,
        'is_published' => $status === 'published',
        'is_approved' => $status === 'published',
    ]);
}

test('a user cannot view another users private property', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $ad = createAuthorizedTestAd($owner);

    $this->actingAs($attacker)
        ->get(route('dashboard.properties.show', $ad->id))
        ->assertForbidden();
});

test('a user cannot update another users property', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();
    $ad = createAuthorizedTestAd($owner);

    $this->actingAs($attacker)
        ->put(route('dashboard.properties.update', $ad->id), ['title' => 'Stolen'])
        ->assertForbidden();

    expect($ad->fresh()->title)->toBe('Private property');
});

test('a non admin cannot moderate a property', function () {
    $user = User::factory()->create();
    $ad = createAuthorizedTestAd($user, 'pending_validation');

    $this->actingAs($user)
        ->post(route('dashboard.properties.approve', $ad->id))
        ->assertForbidden();
});

test('an admin can view and moderate any property', function () {
    Mail::fake();
    Role::findOrCreate('admin', 'web');
    $owner = User::factory()->create();
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $ad = createAuthorizedTestAd($owner, 'pending_validation');

    $this->actingAs($admin)
        ->get(route('dashboard.properties.show', $ad->id))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('dashboard.properties.approve', $ad->id))
        ->assertRedirect(route('dashboard.properties.validation'));

    expect($ad->fresh()->status)->toBe('published');
    Mail::assertQueued(PropertyApprovedMail::class);
});

test('an unpublished property cannot be added to favorites by id', function () {
    $owner = User::factory()->create();
    $user = User::factory()->create();
    $ad = createAuthorizedTestAd($owner);

    $this->actingAs($user)
        ->post(route('dashboard.properties.favorite', $ad->id))
        ->assertNotFound();

    expect($user->favorites()->count())->toBe(0);
});

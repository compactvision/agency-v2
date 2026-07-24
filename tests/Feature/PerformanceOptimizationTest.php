<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Domains\Categories\Services\CategoryService;
use App\Models\User;
use App\Support\ReferenceCache;
use Illuminate\Support\Facades\Cache;

it('returns lightweight public ads with only the primary image', function () {
    $owner = User::factory()->create();
    $category = Category::create([
        'name' => 'Performance',
        'slug' => 'performance',
        'is_active' => true,
        'position' => 1,
    ]);
    $ad = Ad::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'PERF-001',
        'title' => 'Annonce légère',
        'description' => str_repeat('Description longue ', 30),
        'price' => 100000,
        'currency' => 'USD',
        'status' => 'published',
        'is_published' => true,
        'is_approved' => true,
    ]);
    $ad->images()->createMany([
        ['path' => 'properties/secondary.webp', 'position' => 2],
        ['path' => 'properties/primary.webp', 'position' => 1],
    ]);

    $this->getJson('/api/ads/public')
        ->assertOk()
        ->assertJsonCount(1, 'data.data.0.images')
        ->assertJsonPath('data.data.0.image.url', 'properties/primary.webp')
        ->assertJsonPath('data.data.0.images_count', 2)
        ->assertJsonMissingPath('data.data.0.user')
        ->assertJsonMissingPath('data.data.0.amenities')
        ->assertJsonMissingPath('data.data.0.latitude')
        ->assertJsonMissingPath('data.data.0.longitude');
});

it('caches reference lists and invalidates them after a change', function () {
    Cache::clear();
    $category = Category::create([
        'name' => 'Maison',
        'slug' => 'maison',
        'is_active' => true,
        'position' => 1,
    ]);

    app(CategoryService::class)->all();
    expect(Cache::has(ReferenceCache::CATEGORIES))->toBeTrue();

    $category->update(['name' => 'Maison familiale']);
    expect(Cache::has(ReferenceCache::CATEGORIES))->toBeFalse();
});

it('keeps one shared cron responsible for scheduled jobs and queue draining', function () {
    $schedule = file_get_contents(base_path('routes/console.php'));
    $documentation = file_get_contents(base_path('docs/HOSTKING_CRON.md'));

    expect($schedule)
        ->toContain('queue:work database')
        ->toContain("->name('queue-drain')")
        ->toContain('->withoutOverlapping()')
        ->and($documentation)
        ->toContain('artisan schedule:run')
        ->toContain('Ne pas ajouter un second cron');
});

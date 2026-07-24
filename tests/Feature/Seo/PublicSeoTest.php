<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Domains\CMS\Models\Page;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

function createPublishedSeoAd(array $overrides = []): Ad
{
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Appartement',
        'slug' => 'apartment',
        'is_active' => true,
        'position' => 1,
    ]);

    return Ad::create(array_merge([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'AD-SEO1234',
        'title' => 'Appartement avec vue à Gombe',
        'description' => 'Appartement lumineux à vendre au centre de la Gombe.',
        'price' => 250000,
        'currency' => 'USD',
        'status' => 'published',
        'is_published' => true,
        'is_approved' => true,
    ], $overrides));
}

beforeEach(function () {
    Cache::flush();
});

test('public pages render server side seo metadata', function () {
    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertSee('<meta name="description"', false)
        ->assertSee('<link rel="canonical" href="'.route('home').'">', false)
        ->assertSee('property="og:title"', false)
        ->assertSee('name="twitter:card"', false)
        ->assertSee('application/ld+json', false);
});

test('a published property has a stable slug canonical and structured data', function () {
    $ad = createPublishedSeoAd();

    expect($ad->slug)->toBe('appartement-avec-vue-a-gombe-ad-seo1234');
    $originalSlug = $ad->slug;
    $ad->update(['title' => 'Titre modifié sans casser le lien']);
    expect($ad->fresh()->slug)->toBe($originalSlug);

    $this->get(route('property.show', $originalSlug))
        ->assertOk()
        ->assertSee('<link rel="canonical" href="'.route('property.show', $originalSlug).'">', false)
        ->assertSee($ad->description)
        ->assertSee('https://schema.org/InStock', false)
        ->assertSee('BreadcrumbList', false);
});

test('legacy numeric property urls permanently redirect to the canonical slug', function () {
    $ad = createPublishedSeoAd();

    $this->get(route('property.legacy', $ad->id))
        ->assertRedirect(route('property.show', $ad->slug))
        ->assertStatus(301);
});

test('filtered result pages are not indexed', function () {
    createPublishedSeoAd();

    $this->get(route('properties', ['sale_type' => 'sale']))
        ->assertOk()
        ->assertSee('content="noindex, follow, max-image-preview:large"', false);
});

test('sitemap contains only indexable published content', function () {
    $ad = createPublishedSeoAd();
    $publishedPage = Page::create([
        'title' => 'Conseils immobiliers',
        'slug' => 'conseils-immobiliers',
        'status' => 'published',
    ]);
    $hiddenPage = Page::create([
        'title' => 'Page privée',
        'slug' => 'page-privee',
        'status' => 'published',
        'noindex' => true,
    ]);

    $response = $this->get(route('sitemap'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee(route('property.show', $ad->slug), false)
        ->assertSee(route('pages.show', $publishedPage->slug), false)
        ->assertDontSee(route('pages.show', $hiddenPage->slug), false);

    expect(simplexml_load_string($response->getContent()))->not->toBeFalse();
});

test('robots file protects private surfaces and exposes the sitemap', function () {
    $this->get(route('robots'))
        ->assertOk()
        ->assertSee('Disallow: /dashboard/', false)
        ->assertSee('Disallow: /api/', false)
        ->assertSee('Sitemap: '.route('sitemap'), false);
});

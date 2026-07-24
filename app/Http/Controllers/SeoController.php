<?php

namespace App\Http\Controllers;

use App\Domains\Ads\Models\Ad;
use App\Domains\CMS\Models\Page;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $entries = Cache::remember('seo.sitemap.entries', now()->addHour(), function () {
            $static = collect([
                ['loc' => route('home'), 'lastmod' => null, 'priority' => '1.0'],
                ['loc' => route('properties'), 'lastmod' => null, 'priority' => '0.9'],
                ['loc' => route('about'), 'lastmod' => null, 'priority' => '0.6'],
                ['loc' => route('tarifs'), 'lastmod' => null, 'priority' => '0.6'],
                ['loc' => route('faq'), 'lastmod' => null, 'priority' => '0.5'],
                ['loc' => route('contact'), 'lastmod' => null, 'priority' => '0.4'],
            ]);

            $pages = Page::query()
                ->where('status', 'published')
                ->where('noindex', false)
                ->latest('updated_at')
                ->limit(5000)
                ->get(['slug', 'updated_at'])
                ->map(fn (Page $page) => [
                    'loc' => route('pages.show', $page->slug),
                    'lastmod' => $page->updated_at?->toAtomString(),
                    'priority' => '0.6',
                ]);

            $ads = Ad::query()
                ->where('is_published', true)
                ->where('is_approved', true)
                ->whereNotNull('slug')
                ->with(['images' => fn ($query) => $query->orderBy('position')->limit(1)])
                ->latest('updated_at')
                ->limit(40000)
                ->get(['id', 'slug', 'title', 'updated_at'])
                ->map(fn (Ad $ad) => [
                    'loc' => route('property.show', $ad->slug),
                    'lastmod' => $ad->updated_at?->toAtomString(),
                    'priority' => '0.8',
                    'image' => $ad->images->first()
                        ? asset('storage/'.$ad->images->first()->path)
                        : null,
                    'image_title' => $ad->title,
                ]);

            return $static->concat($pages)->concat($ads)->values()->all();
        });

        return response()
            ->view('seo.sitemap', ['entries' => $entries])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /api/',
            'Disallow: /dashboard/',
            'Disallow: /settings/',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /forgot-password',
            '',
            'Sitemap: '.route('sitemap'),
            '',
        ]);

        return response($content, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}

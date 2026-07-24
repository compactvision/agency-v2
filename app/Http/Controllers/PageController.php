<?php

namespace App\Http\Controllers;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Requests\PublicAdFilterRequest;
use App\Domains\Ads\Resources\AdResource;
use App\Domains\Ads\Resources\AdSummaryResource;
use App\Domains\Ads\Services\AdService;
use App\Domains\Amenities\Models\Amenity;
use App\Domains\Billing\Models\Plan;
use App\Domains\Categories\Models\Category;
use App\Domains\CMS\Models\Page;
use App\Domains\Locations\Models\Municipality;
use App\Domains\System\Models\SystemSetting;
use App\Http\Requests\ContactOwnerRequest;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessage;
use App\Mail\PropertyOwnerContactMessage;
use App\Support\ReferenceCache;
use App\Support\Seo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PageController extends Controller
{
    public function __construct(
        protected AdService $adService
    ) {}

    public function home()
    {
        $properties = $this->adService->publicList([
            'sort' => 'newest',
            'limit' => 6,
        ]);
        $municipalities = $this->publicMunicipalities();

        return Inertia::render('Home', [
            'properties' => AdSummaryResource::collection($properties)->resolve(),
            'municipalities' => $municipalities,
            'favorites' => auth()->user()?->favorites()->pluck('ads.id')->all() ?? [],
            'seo' => Seo::page(
                'Immobilier à Kinshasa',
                'Découvrez des maisons, appartements, terrains et locaux à vendre ou à louer à Kinshasa.',
                route('home'),
                jsonLd: Seo::organization(),
            ),
        ]);
    }

    public function about()
    {
        return Inertia::render('About', [
            'seo' => Seo::page(
                'À propos',
                'Découvrez notre plateforme immobilière, notre mission et notre accompagnement des acheteurs, locataires et vendeurs.',
                route('about'),
            ),
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact', [
            'seo' => Seo::page(
                'Contact',
                'Contactez notre équipe pour votre recherche, vente ou location immobilière à Kinshasa.',
                route('contact'),
            ),
        ]);
    }

    public function contactSend(ContactRequest $request)
    {
        $contact = $request->validated();
        $settings = SystemSetting::where('key', 'site_settings')->first()?->value ?? [];
        $recipient = $settings['app_email']
            ?? $settings['email']
            ?? config('mail.from.address');

        Mail::to($recipient)->send(new ContactMessage($contact));

        return back()->with('success', 'Votre message a été envoyé avec succès.');
    }

    public function contactOwner(ContactOwnerRequest $request, Ad $ad)
    {
        abort_unless($ad->is_published && $ad->is_approved, 404);

        $ad->loadMissing('user');
        Mail::to($ad->user->email)->send(
            new PropertyOwnerContactMessage(
                $ad,
                $request->user(),
                $request->validated(),
            ),
        );

        return back()->with(
            'success',
            'Votre demande a été envoyée au propriétaire.',
        );
    }

    public function tarifs(Request $request)
    {
        $plans = Plan::with('features')
            ->where('is_active', true)
            ->orderBy('position')
            ->get();

        return Inertia::render('Tarifs', [
            'plans' => $plans,
            'currentPlanId' => $request->user()?->subscription?->plan_id,
            'seo' => Seo::page(
                'Tarifs',
                'Consultez nos offres pour publier et promouvoir vos annonces immobilières.',
                route('tarifs'),
            ),
        ]);
    }

    public function faq()
    {
        return Inertia::render('Faq', [
            'seo' => Seo::page(
                'Questions fréquentes',
                'Retrouvez les réponses aux questions fréquentes sur les annonces, abonnements et transactions immobilières.',
                route('faq'),
            ),
        ]);
    }

    public function properties(PublicAdFilterRequest $request)
    {
        $filters = $request->validated();
        $properties = $this->adService->publicList($filters);
        $hasFilters = collect($filters)
            ->except(['page'])
            ->filter(function ($value, $key) {
                if ($key === 'sort') {
                    return $value !== 'newest';
                }

                if ($key === 'per_page') {
                    return (int) $value !== 12;
                }

                return filled($value);
            })
            ->isNotEmpty();
        $canonical = $properties->currentPage() > 1 && ! $hasFilters
            ? route('properties', ['page' => $properties->currentPage()])
            : route('properties');

        return Inertia::render('properties/Properties', [
            'properties' => [
                'data' => AdSummaryResource::collection($properties->items())->resolve(),
                'meta' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'total' => $properties->total(),
                    'per_page' => $properties->perPage(),
                ],
                'links' => $properties->linkCollection()->toArray(),
            ],
            'municipalities' => $this->publicMunicipalities(),
            'allAmenities' => ReferenceCache::remember(
                ReferenceCache::PUBLIC_AMENITIES,
                fn () => Amenity::query()
                    ->where('is_active', true)
                    ->orderBy('position')
                    ->get(),
            ),
            'types' => ReferenceCache::remember(
                ReferenceCache::PUBLIC_PROPERTY_TYPES,
                fn () => Category::query()
                    ->where('is_active', true)
                    ->orderBy('position')
                    ->pluck('slug'),
            ),
            'favorites' => auth()->user()?->favorites()->pluck('ads.id')->all() ?? [],
            // Preserve an object shape when no filter is supplied. An empty PHP
            // array becomes [] in JSON and exposes Array.prototype.sort in React.
            'filters' => (object) $filters,
            'seo' => Seo::page(
                'Propriétés à vendre et à louer',
                'Parcourez les annonces immobilières vérifiées disponibles à Kinshasa et filtrez par type, prix et localisation.',
                $canonical,
                robots: $hasFilters
                    ? 'noindex, follow, max-image-preview:large'
                    : 'index, follow, max-image-preview:large',
            ),
        ]);
    }

    public function language(Request $request)
    {
        $request->validate(['language' => 'required|string|in:en,fr']);

        session(['locale' => $request->language]);
        app()->setLocale($request->language);

        return back();
    }

    public function profile()
    {
        return Inertia::render('profile/Profile', [
            'user' => auth()->user()?->load('newsletter_subscription'),
        ]);
    }

    public function page($slug)
    {
        $page = Page::with('sections')->where('slug', $slug)->firstOrFail();

        if ($page->status !== 'published') {
            abort(404);
        }

        return Inertia::render('Page', [
            'page' => $page,
            'seo' => Seo::page(
                $page->meta_title ?: $page->title,
                $page->meta_description
                    ?: $page->sections->pluck('paragraph')->filter()->implode(' '),
                route('pages.show', $page->slug),
                $page->og_image,
                robots: $page->noindex
                    ? 'noindex, nofollow'
                    : 'index, follow, max-image-preview:large',
            ),
        ]);
    }

    public function property(Ad $ad)
    {
        abort_unless($ad->is_published && $ad->is_approved, 404);
        $property = $ad->load([
            'category',
            'amenities',
            'images',
            'details',
            'user',
            'municipality',
            'city',
            'country',
        ]);

        return Inertia::render('properties/PropertyDetails', [
            'property' => (new AdResource($property))->resolve(),
            'seo' => Seo::property($property),
        ]);
    }

    public function legacyProperty(int $id)
    {
        $property = $this->adService->getPublicAd($id);

        return redirect()->route('property.show', $property->slug, 301);
    }

    private function publicMunicipalities()
    {
        return ReferenceCache::remember(
            ReferenceCache::PUBLIC_MUNICIPALITIES,
            fn () => Municipality::query()
                ->withCount([
                    'properties as properties' => fn ($query) => $query
                        ->where('is_published', true)
                        ->where('is_approved', true),
                ])
                ->orderByDesc('properties')
                ->get(),
        );
    }
}

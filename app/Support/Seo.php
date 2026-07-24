<?php

namespace App\Support;

use App\Domains\Ads\Models\Ad;
use Illuminate\Support\Str;

class Seo
{
    public static function page(
        string $title,
        string $description,
        string $canonical,
        ?string $image = null,
        string $type = 'website',
        array $jsonLd = [],
        string $robots = 'index, follow, max-image-preview:large',
    ): array {
        $siteName = config('app.name', 'Agency');
        $description = trim(preg_replace('/\s+/', ' ', strip_tags($description)));
        $description = $description !== ''
            ? $description
            : 'Découvrez les biens et services disponibles sur notre plateforme immobilière.';
        $fullTitle = Str::contains(Str::lower($title), Str::lower($siteName))
            ? $title
            : "{$title} - {$siteName}";

        return [
            'title' => Str::limit(trim(strip_tags($fullTitle)), 65, ''),
            'description' => Str::limit($description, 160, ''),
            'canonical' => $canonical,
            'image' => self::absoluteImage($image),
            'type' => $type,
            'robots' => $robots,
            'locale' => app()->getLocale() === 'en' ? 'en_US' : 'fr_CD',
            'site_name' => $siteName,
            'json_ld' => $jsonLd,
        ];
    }

    private static function absoluteImage(?string $image): string
    {
        if (! $image) {
            return asset('apple-touch-icon.png');
        }

        return Str::startsWith($image, ['http://', 'https://'])
            ? $image
            : asset(ltrim($image, '/'));
    }

    public static function organization(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'RealEstateAgent',
            'name' => config('app.name', 'Agency'),
            'url' => route('home'),
            'logo' => asset('brand/the-agency-logo-light.png'),
        ];
    }

    public static function property(Ad $ad): array
    {
        $url = route('property.show', $ad->slug);
        $location = collect([
            $ad->municipality?->name,
            $ad->city?->name,
            $ad->country?->name,
        ])->filter()->implode(', ');
        $description = $ad->description
            ?: "{$ad->title}, bien immobilier {$ad->ad_type} à {$location}.";
        $images = $ad->images
            ->sortBy('position')
            ->map(fn ($image) => asset('storage/'.$image->path))
            ->values()
            ->all();

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Offer',
                    'url' => $url,
                    'price' => (string) $ad->price,
                    'priceCurrency' => $ad->currency,
                    'availability' => 'https://schema.org/InStock',
                    'itemOffered' => array_filter([
                        '@type' => 'Residence',
                        'name' => $ad->title,
                        'description' => Str::limit(strip_tags($description), 500, ''),
                        'image' => $images,
                        'floorSize' => $ad->surface ? [
                            '@type' => 'QuantitativeValue',
                            'value' => $ad->surface,
                            'unitCode' => 'MTK',
                        ] : null,
                        'address' => $location ? [
                            '@type' => 'PostalAddress',
                            'addressLocality' => $ad->municipality?->name,
                            'addressRegion' => $ad->city?->name,
                            'addressCountry' => $ad->country?->name,
                        ] : null,
                    ]),
                ],
                [
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        [
                            '@type' => 'ListItem',
                            'position' => 1,
                            'name' => 'Accueil',
                            'item' => route('home'),
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 2,
                            'name' => 'Propriétés',
                            'item' => route('properties'),
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 3,
                            'name' => $ad->title,
                            'item' => $url,
                        ],
                    ],
                ],
            ],
        ];

        return self::page(
            $ad->title,
            $description,
            $url,
            $images[0] ?? null,
            'article',
            $jsonLd,
        );
    }
}

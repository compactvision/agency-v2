<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

final class ReferenceCache
{
    public const COUNTRIES = 'references.countries.v1';

    public const CITIES = 'references.cities.v1';

    public const MUNICIPALITIES = 'references.municipalities.v1';

    public const PUBLIC_MUNICIPALITIES = 'references.public-municipalities.v1';

    public const CATEGORIES = 'references.categories.v1';

    public const PUBLIC_PROPERTY_TYPES = 'references.public-property-types.v1';

    public const AMENITIES = 'references.amenities.v1';

    public const PUBLIC_AMENITIES = 'references.public-amenities.v1';

    public static function remember(string $key, Closure $resolver): mixed
    {
        return Cache::remember(
            $key,
            max(60, (int) config('performance.reference_cache_ttl')),
            $resolver,
        );
    }

    /**
     * @param  list<string>  $keys
     */
    public static function forget(array $keys): void
    {
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }
}

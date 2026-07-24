<?php

namespace App\Domains\Amenities\Models;

use App\Domains\Ads\Models\Ad;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_active',
        'position',
    ];

    protected static function booted(): void
    {
        $flush = fn () => ReferenceCache::forget([
            ReferenceCache::AMENITIES,
            ReferenceCache::PUBLIC_AMENITIES,
        ]);

        static::saved($flush);
        static::deleted($flush);
    }

    public function ads()
    {
        return $this->belongsToMany(
            Ad::class,
            'ad_amenity'
        );
    }
}

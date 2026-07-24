<?php

namespace App\Domains\Categories\Models;

use App\Domains\Ads\Models\Ad;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_active',
        'position',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        $flush = fn () => ReferenceCache::forget([
            ReferenceCache::CATEGORIES,
            ReferenceCache::PUBLIC_PROPERTY_TYPES,
        ]);

        static::saved($flush);
        static::deleted($flush);
    }

    // Relations (Ads will reference this)
    public function ads()
    {
        return $this->hasMany(Ad::class);
    }
}

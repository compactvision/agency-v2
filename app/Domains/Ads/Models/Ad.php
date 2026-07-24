<?php

namespace App\Domains\Ads\Models;

use App\Domains\Amenities\Models\Amenity;
use App\Domains\Categories\Models\Category;
use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use App\Models\User;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Ad extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'ad_type',
        'reference',
        'slug',
        'title',
        'description',
        'price',
        'currency',
        'surface',
        'country_id',
        'city_id',
        'municipality_id',
        'latitude',
        'longitude',
        'status',
        'rejection_reason',
        'is_published',
        'is_approved',
    ];

    protected static function booted(): void
    {
        static::saving(function (Ad $ad) {
            if ($ad->slug === null) {
                $ad->slug = Str::slug("{$ad->title}-{$ad->reference}");
            }
        });

        $flush = function () {
            Cache::forget('seo.sitemap.entries');
            ReferenceCache::forget([ReferenceCache::PUBLIC_MUNICIPALITIES]);
        };

        static::saved($flush);
        static::deleted($flush);
    }

    /* RELATIONS */

    public function details()
    {
        return $this->hasOne(AdDetail::class);
    }

    public function images()
    {
        return $this->hasMany(AdImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(AdImage::class)->ofMany([
            'position' => 'min',
            'id' => 'min',
        ]);
    }

    public function amenities()
    {
        return $this->belongsToMany(
            Amenity::class,
            'ad_amenity'
        );
    }

    public function category()
    {
        return $this->belongsTo(
            Category::class
        );
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'ad_id', 'user_id')->withTimestamps();
    }
}

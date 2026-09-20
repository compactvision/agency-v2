<?php

namespace App\Domains\Ads\Models;

use App\Domains\Amenities\Models\Amenity;
use App\Domains\Categories\Models\Category;
use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use App\Models\PropertyVisit;
use App\Models\User;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Builder;
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
            if ($ad->is_published && $ad->is_approved && ! $ad->first_published_at) {
                $ad->first_published_at = now()->format('Y-m-d H:i:s.u');
            }

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

    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query->where('status', 'published')->where('is_published', true)->where('is_approved', true)
            ->whereNull('hidden_reason')
            ->whereHas('user', fn ($q) => $q->whereNull('anonymized_at')->whereHas('subscriptions', fn ($s) => $s->usable()));
    }

    public function isPubliclyVisible(): bool
    {
        return static::whereKey($this->id)->publiclyVisible()->exists();
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

    public function visits()
    {
        return $this->hasMany(PropertyVisit::class);
    }
}

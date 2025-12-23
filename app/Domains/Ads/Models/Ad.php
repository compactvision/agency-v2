<?php

namespace App\Domains\Ads\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'ad_type',
        'reference',
        'title',
        'description',
        'price',
        'currency',
        'surface',
        'country_id',
        'city_id',
        'municipality_id',
        'status',
        'rejection_reason',
        'is_published',
    ];

    /* RELATIONS */

    public function details()
    {
        return $this->hasOne(AdDetail::class);
    }

    public function images()
    {
        return $this->hasMany(AdImage::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(
            \App\Domains\Amenities\Models\Amenity::class,
            'ad_amenity'
        );
    }

    public function category()
    {
        return $this->belongsTo(
            \App\Domains\Categories\Models\Category::class
        );
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}

<?php

namespace App\Domains\Amenities\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_active',
        'position',
    ];

    public function ads()
    {
        return $this->belongsToMany(
            \App\Domains\Ads\Models\Ad::class,
            'ad_amenity'
        );
    }

}

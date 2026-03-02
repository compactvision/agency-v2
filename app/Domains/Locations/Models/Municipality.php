<?php

namespace App\Domains\Locations\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id',
        'name',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function properties()
    {
        return $this->hasMany(\App\Domains\Ads\Models\Ad::class);
    }
}

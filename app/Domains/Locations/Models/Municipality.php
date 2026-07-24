<?php

namespace App\Domains\Locations\Models;

use App\Domains\Ads\Models\Ad;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id',
        'name',
    ];

    protected static function booted(): void
    {
        $flush = fn () => ReferenceCache::forget([
            ReferenceCache::MUNICIPALITIES,
            ReferenceCache::PUBLIC_MUNICIPALITIES,
        ]);

        static::saved($flush);
        static::deleted($flush);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function properties()
    {
        return $this->hasMany(Ad::class);
    }
}

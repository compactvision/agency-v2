<?php

namespace App\Domains\Locations\Models;

use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'iso_code',
    ];

    protected static function booted(): void
    {
        $flush = fn () => ReferenceCache::forget([
            ReferenceCache::COUNTRIES,
            ReferenceCache::CITIES,
            ReferenceCache::MUNICIPALITIES,
            ReferenceCache::PUBLIC_MUNICIPALITIES,
        ]);

        static::saved($flush);
        static::deleted($flush);
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}

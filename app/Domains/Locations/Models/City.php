<?php

namespace App\Domains\Locations\Models;

use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
    ];

    protected static function booted(): void
    {
        $flush = fn () => ReferenceCache::forget([
            ReferenceCache::CITIES,
            ReferenceCache::MUNICIPALITIES,
            ReferenceCache::PUBLIC_MUNICIPALITIES,
        ]);

        static::saved($flush);
        static::deleted($flush);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function municipalities()
    {
        return $this->hasMany(Municipality::class);
    }
}

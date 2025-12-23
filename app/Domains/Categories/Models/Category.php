<?php

namespace App\Domains\Categories\Models;

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

    // Relations (Ads will reference this)
    public function ads()
    {
        return $this->hasMany(\App\Domains\Ads\Models\Ad::class);
    }
}

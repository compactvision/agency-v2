<?php

namespace App\Domains\Ads\Models;

use Illuminate\Database\Eloquent\Model;

class AdImage extends Model
{
    protected $fillable = [
        'ad_id',
        'path',
        'position',
    ];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}

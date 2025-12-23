<?php

namespace App\Domains\Ads\Models;

use Illuminate\Database\Eloquent\Model;

class AdDetail extends Model
{
    protected $fillable = [
        'ad_id',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}

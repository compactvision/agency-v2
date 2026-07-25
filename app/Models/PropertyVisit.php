<?php

namespace App\Models;

use App\Domains\Ads\Models\Ad;
use Illuminate\Database\Eloquent\Model;

class PropertyVisit extends Model
{
    protected $fillable = [
        'ad_id',
        'visitor_id',
        'owner_id',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'scheduled_at',
        'status',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    public function property()
    {
        return $this->belongsTo(Ad::class, 'ad_id');
    }

    public function visitor()
    {
        return $this->belongsTo(User::class, 'visitor_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}

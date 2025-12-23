<?php

namespace App\Domains\Billing\Models;

use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    protected $fillable = [
        'event_type',
        'payload',
        'ip_address',
        'headers',
        'received_at',
    ];

    protected $casts = [
        'payload'     => 'array',
        'headers'     => 'array',
        'received_at' => 'datetime',
    ];
}

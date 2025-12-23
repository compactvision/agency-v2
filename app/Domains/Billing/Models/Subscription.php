<?php

namespace App\Domains\Billing\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_id',
        'transaction_id',
        'payment_session_id',
        'payment_id',
        'status',
        'amount',
        'currency',
        'started_at',
        'expires_at',
        'failure_reason',
        'payment_method',
    ];

    protected $casts = [
        'amount'      => 'decimal:2',
        'started_at'  => 'datetime',
        'expires_at'  => 'datetime',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

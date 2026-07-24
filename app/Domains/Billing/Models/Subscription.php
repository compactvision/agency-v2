<?php

namespace App\Domains\Billing\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'plan_id',
        'plan_name',
        'plan_interval',
        'plan_features',
        'transaction_id',
        'payment_session_id',
        'payment_id',
        'status',
        'amount',
        'currency',
        'interval',
        'approved_by',
        'cancelled_at',
        'started_at',
        'expires_at',
        'failure_reason',
        'payment_method',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'plan_features' => 'array',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' && (! $this->expires_at || $this->expires_at->isFuture());
    }
}

<?php

namespace App\Domains\Billing\Models;

use App\Domains\Billing\Domain\ValueObjects\PlanLimits;
use App\Models\User;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

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
        'payment_customer_email',
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

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('seo.sitemap.entries');
            ReferenceCache::forget([ReferenceCache::PUBLIC_MUNICIPALITIES]);
        });
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeUsable(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->whereNotNull('started_at')->where('started_at', '<=', now())
            ->whereNotNull('expires_at')->where('expires_at', '>', now())
            ->where(fn ($q) => $q->whereNotNull('payment_id')->orWhereNotNull('approved_by'));
    }

    public function isActive(): bool
    {
        return $this->status === 'active'
            && ($this->payment_id !== null || $this->approved_by !== null)
            && $this->started_at !== null && $this->started_at->lte(now())
            && $this->expires_at !== null && $this->expires_at->gt(now());
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->isActive();
    }

    public function notices(): HasMany
    {
        return $this->hasMany(SubscriptionNotice::class);
    }

    public function limits(): PlanLimits
    {
        $features = $this->plan_features !== null
            ? collect($this->plan_features)->map(fn ($feature) => (object) $feature)
            : ($this->plan?->features ?? collect());

        return PlanLimits::fromFeatures($features);
    }
}

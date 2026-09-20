<?php

namespace App\Domains\Billing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionNotice extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['context' => 'array', 'sent_at' => 'datetime', 'skipped_at' => 'datetime'];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class)->withTrashed();
    }
}

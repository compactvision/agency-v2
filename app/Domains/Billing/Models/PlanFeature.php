<?php

namespace App\Domains\Billing\Models;

use Illuminate\Database\Eloquent\Model;

class PlanFeature extends Model
{
    protected $fillable = [
        'plan_id',
        'name',
        'value',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}

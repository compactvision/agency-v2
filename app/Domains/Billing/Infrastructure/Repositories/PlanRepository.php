<?php

namespace App\Domains\Billing\Infrastructure\Repositories;

use App\Domains\Billing\Models\Plan;

class PlanRepository
{
    public function findOrFail(int $id): Plan
    {
        return Plan::with('features')->findOrFail($id);
    }

    public function allActive(): \Illuminate\Database\Eloquent\Collection
    {
        return Plan::with('features')
            ->where('is_active', true)
            ->orderBy('position')
            ->get();
    }
}

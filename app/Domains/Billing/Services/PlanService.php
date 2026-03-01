<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Plan;
use Illuminate\Support\Facades\DB;

class PlanService
{
    /**
     * List plans with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 10)
    {
        $query = Plan::query()->with('features')->orderBy('created_at', 'desc');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new plan.
     */
    public function create(array $data): Plan
    {
        return DB::transaction(function () use ($data) {
            $plan = Plan::create([
                'name' => $data['name'],
                'price' => $data['price'],
                'interval' => $data['duration'],
                'description' => $data['description'],
                'payment_method' => $data['payment_method'],
                'is_active' => true,
            ]);

            $this->syncFeatures($plan, $data);

            return $plan;
        });
    }

    /**
     * Update an existing plan.
     */
    public function update(Plan $plan, array $data): Plan
    {
        return DB::transaction(function () use ($plan, $data) {
            $plan->update([
                'name' => $data['name'],
                'price' => $data['price'],
                'interval' => $data['duration'],
                'description' => $data['description'],
                'payment_method' => $data['payment_method'],
            ]);

            $this->syncFeatures($plan, $data);

            return $plan;
        });
    }

    /**
     * Sync features and metadata for a plan.
     */
    protected function syncFeatures(Plan $plan, array $data): void
    {
        // Delete and re-create all features (including metadata)
        $plan->features()->delete();

        $metadata = [
            'listing_limit' => $data['listing_limit'] ?? null,
            'image_limit' => $data['image_limit'] ?? null,
            'is_featured' => $data['is_featured'] ?? false,
            'highlight_homepage' => $data['highlight_homepage'] ?? false,
            'priority_support' => $data['priority_support'] ?? false,
            'analytics_access' => $data['analytics_access'] ?? false,
        ];

        foreach ($metadata as $key => $value) {
            $plan->features()->create([
                'name' => $key,
                'value' => is_bool($value) ? ($value ? '1' : '0') : $value,
            ]);
        }

        if (!empty($data['features'])) {
            foreach ($data['features'] as $featureName) {
                // Avoid double inserting if it was already in metadata (though unlikely with current logic)
                if (!array_key_exists($featureName, $metadata)) {
                    $plan->features()->create(['name' => $featureName]);
                }
            }
        }
    }

    /**
     * Delete a plan.
     */
    public function delete(Plan $plan): bool
    {
        return $plan->delete();
    }
}

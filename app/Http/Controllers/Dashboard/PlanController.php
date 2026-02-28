<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Billing\Models\Plan;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $query = Plan::query()->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        $plans = $query->paginate(10);

        return Inertia::render('dashboard/plans/Tarifs', [
            'plans' => [
                'data' => collect($plans->items())->map(function($p) {
                    $features = $p->features;
                    
                    // Metadata keys to extract from features
                    $metadataKeys = [
                        'listing_limit', 'image_limit', 'is_featured', 
                        'highlight_homepage', 'priority_support', 'analytics_access'
                    ];
                    
                    $data = [
                        'id' => $p->id,
                        'name' => $p->name,
                        'description' => $p->description,
                        'price' => $p->price,
                        'duration' => $p->interval,
                        'payment_method' => $p->payment_method,
                    ];

                    foreach ($metadataKeys as $key) {
                        $feature = $features->firstWhere('name', $key);
                        $value = $feature ? $feature->value : null;
                        
                        // Handle boolean casting
                        if (str_starts_with($key, 'is_') || str_ends_with($key, '_access') || str_contains($key, 'support') || str_contains($key, 'homepage')) {
                            $data[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                        } else {
                            $data[$key] = $value;
                        }
                    }

                    // For the UI features list (bullet points), exclude metadata keys
                    $data['features'] = $features->reject(fn($f) => in_array($f->name, $metadataKeys))
                        ->map(fn($f) => ['name' => $f->name])
                        ->values();

                    return $data;
                }),
                'meta' => [
                    'current_page' => $plans->currentPage(),
                    'last_page'    => $plans->lastPage(),
                    'total'        => $plans->total(),
                    'from'         => $plans->firstItem(),
                    'to'           => $plans->lastItem(),
                ],
                'links' => $plans->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(\App\Http\Requests\Dashboard\StorePlanRequest $request)
    {
        $validated = $request->validated();

        $plan = Plan::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'interval' => $validated['duration'],
            'description' => $validated['description'],
            'payment_method' => $validated['payment_method'],
            'is_active' => true,
        ]);

        // Save Metadata as features
        $metadata = [
            'listing_limit' => $validated['listing_limit'] ?? null,
            'image_limit' => $validated['image_limit'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'highlight_homepage' => $validated['highlight_homepage'] ?? false,
            'priority_support' => $validated['priority_support'] ?? false,
            'analytics_access' => $validated['analytics_access'] ?? false,
        ];

        foreach ($metadata as $key => $value) {
            $plan->features()->create([
                'name' => $key,
                'value' => is_bool($value) ? ($value ? '1' : '0') : $value,
            ]);
        }

        if (!empty($validated['features'])) {
            foreach ($validated['features'] as $featureName) {
                $plan->features()->create(['name' => $featureName]);
            }
        }

        return redirect()->back()->with('success', 'Plan créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdatePlanRequest $request, $id)
    {
        $plan = Plan::findOrFail($id);
        $validated = $request->validated();

        $plan->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'interval' => $validated['duration'],
            'description' => $validated['description'],
            'payment_method' => $validated['payment_method'],
        ]);

        // Delete and re-create all features (including metadata)
        $plan->features()->delete();

        $metadata = [
            'listing_limit' => $validated['listing_limit'] ?? null,
            'image_limit' => $validated['image_limit'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'highlight_homepage' => $validated['highlight_homepage'] ?? false,
            'priority_support' => $validated['priority_support'] ?? false,
            'analytics_access' => $validated['analytics_access'] ?? false,
        ];

        foreach ($metadata as $key => $value) {
            $plan->features()->create([
                'name' => $key,
                'value' => is_bool($value) ? ($value ? '1' : '0') : $value,
            ]);
        }

        if (isset($validated['features'])) {
            foreach ($validated['features'] as $featureName) {
                $plan->features()->create(['name' => $featureName]);
            }
        }

        return redirect()->back()->with('success', 'Plan mis à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $plan = Plan::findOrFail($id);
        $plan->delete();

        return redirect()->back()->with('success', 'Plan supprimé avec succès.');
    }
}

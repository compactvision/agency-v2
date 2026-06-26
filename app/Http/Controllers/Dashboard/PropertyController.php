<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdService;
use App\Domains\Ads\Requests\StoreAdRequest;
use App\Domains\Ads\Requests\UpdateAdRequest;
use App\Domains\Ads\Resources\AdResource;

class PropertyController extends Controller
{
    /**
     * Properties Management
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ad::query()
            ->with(['category', 'images', 'details', 'municipality', 'user']);

        // Role-based filtering: Sellers/Agencies only see their own properties
        // Admins and Super-admins see everything
        if (!$user->hasRole(['admin', 'super-admin'])) {
            $query->where('user_id', auth()->id());
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Safety check for sort fields
        $allowedSorts = ['created_at', 'price', 'title'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->latest();
        }

        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('dashboard/properties/Properties', [
            'properties' => [
                'data' => AdResource::collection($properties->items())->resolve(),
                'meta' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'total' => $properties->total(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ],
                'links' => $properties->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search', 'sort_by', 'sort_order']),
            'favorites' => 0, // Placeholder until favorites system is connected
        ]);
    }

    public function validation(Request $request)
    {
        if (!$request->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $query = Ad::query()
            ->with(['category', 'images', 'details', 'municipality', 'user'])
            ->where('status', 'pending_validation');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        $query->latest();
        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('dashboard/properties/Validation', [
            'properties' => [
                'data' => AdResource::collection($properties->items())->resolve(),
                'meta' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'total' => $properties->total(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ],
                'links' => $properties->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/properties/EditProperties', $this->getLookupData());
    }

    public function store(StoreAdRequest $request, AdService $service)
    {
        $ad = $service->create($request->validated(), auth()->id());

        if ($request->boolean('is_published')) {
            $service->submit($ad);
        }

        return redirect()->route('dashboard.properties.index')
            ->with('success', 'Propriété créée avec succès.');
    }

    public function edit($id)
    {
        $property = Ad::with(['details', 'amenities', 'images', 'category'])
            ->findOrFail($id);

        if ($property->user_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        return Inertia::render('dashboard/properties/EditProperties', array_merge(
            $this->getLookupData(),
            ['property' => (new AdResource($property))->resolve()]
        ));
    }

    public function update($id, UpdateAdRequest $request, AdService $service)
    {
        $ad = Ad::findOrFail($id);

        if ($ad->user_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $service->update($ad, $request->validated());

        if ($request->boolean('is_published') && $ad->status === 'draft') {
            $service->submit($ad);
        }

        return redirect()->route('dashboard.properties.index')
            ->with('success', 'Propriété mise à jour avec succès.');
    }

    public function show($id)
    {
        $property = Ad::with(['details', 'amenities', 'images', 'category', 'user', 'municipality'])
            ->findOrFail($id);

        if ($property->user_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        return Inertia::render('dashboard/properties/ShowProperty', [
            'property' => (new AdResource($property))->resolve()
        ]);
    }

    public function validationShow($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $property = Ad::with(['details', 'amenities', 'images', 'category', 'user', 'municipality'])
            ->findOrFail($id);

        return Inertia::render('dashboard/properties/ValidationShow', [
            'property' => (new AdResource($property))->resolve()
        ]);
    }

    public function approve($id, AdService $service)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $property = Ad::findOrFail($id);
        
        try {
            if ($property->status === 'published') {
                // If already published, we toggle it back to pending or draft? 
                // Let's assume for now admin wants to "un-approve" it.
                $property->update([
                    'status' => 'pending_validation',
                    'is_published' => false
                ]);
                return redirect()->back()->with('success', 'Approbation retirée.');
            }

            $service->approve($property);
            return redirect()->back()->with('success', 'Propriété approuvée.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function reject($id, Request $request, AdService $service)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $property = Ad::findOrFail($id);
        $reason = $request->input('reason', 'Non spécifiée');

        try {
            $service->reject($property, $reason);
            return redirect()->back()->with('success', 'Propriété rejetée.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function favorites(Request $request)
    {
        $query = auth()->user()->favorites()->with(['images', 'municipality.city.country']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('ad_type', 'like', "%{$request->search}%")
                  ->orWhereHas('municipality', function($mq) use ($request) {
                      $mq->where('name', 'like', "%{$request->search}%");
                  });
            });
        }

        $sortField = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        // Validation basique des champs de tri
        if (in_array($sortField, ['created_at', 'price', 'title'])) {
            $query->orderBy($sortField, $sortOrder);
        }

        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('dashboard/properties/FavoriteProperties', [
            'properties' => [
                'data' => AdResource::collection($properties->items())->resolve(),
                'meta' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'total' => $properties->total(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ],
                'links' => $properties->linkCollection()->toArray(),
            ],
            'filters' => $request->only(['search', 'sort_field', 'sort_order']),
            'favorites' => auth()->user()->favorites()->pluck('ad_id'),
        ]);
    }

    public function toggleFavorite($id)
    {
        $user = auth()->user();
        $user->favorites()->toggle($id);

        return redirect()->back(); // Ou JsonResponse
    }

    protected function getLookupData()
    {
        return [
            'countries' => \App\Domains\Locations\Models\Country::all()->pluck('name', 'id'),
            'municipalities' => \App\Domains\Locations\Models\Municipality::with('city')->get()->map(function($m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'city' => $m->city?->name,
                    'country' => $m->city?->country?->name,
                ];
            }),
            'amenities' => \App\Domains\Amenities\Models\Amenity::all()->map(function($a) {
                return [
                    'id' => $a->id,
                    'name' => $a->name,
                ];
            }),
            'categories' => \App\Domains\Categories\Models\Category::all()->map(function($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ];
            }),
            'hasActiveSubscription' => auth()->user()->hasActiveSubscription(),
        ];
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdService;
use App\Domains\Ads\Requests\StoreAdRequest;
use App\Domains\Ads\Requests\UpdateAdRequest;

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
            $query->where('user_id', $user->id);
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
            'properties' => $properties,
            'filters' => (object) $request->only(['search', 'sort_by', 'sort_order']),
            'favorites' => 0, // Placeholder until favorites system is connected
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
            ['property' => $property]
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
            'property' => $property
        ]);
    }

    public function approve($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $property = Ad::findOrFail($id);
        $property->is_approved = !$property->is_approved;
        $property->save();

        return redirect()->back()->with('success', $property->is_approved ? 'Propriété approuvée.' : 'Approbation retirée.');
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
            'properties' => $properties,
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
            'hasActiveSubscription' => auth()->user()->subscription?->status === 'active',
        ];
    }
}

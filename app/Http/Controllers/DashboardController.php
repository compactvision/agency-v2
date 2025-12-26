<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
// Assuming some models exist or using dummy data for placeholder pages
// In a real scenario, these would fetch from respective domains

class DashboardController extends Controller
{
    /**
     * Dashboard Home / Overview
     */
    public function index()
    {
        return Inertia::render('dashboard/Index', [
            'properties' => [],
            'logs' => [],
            'metrics' => [
                'properties' => ['total' => 0, 'unapproved' => 0],
                'views' => ['total' => 0],
                'favorites' => ['total' => 0],
            ]
        ]);
    }

    /**
     * Properties Management
     */
    public function properties(Request $request)
    {
        $user = $request->user();
        $query = \App\Domains\Ads\Models\Ad::query()
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
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
            'favorites' => 0, // Placeholder until favorites system is connected
        ]);
    }

    public function createProperty()
    {
        return Inertia::render('dashboard/properties/EditProperties', $this->getLookupData());
    }

    public function storeProperty(\App\Domains\Ads\Requests\StoreAdRequest $request, \App\Domains\Ads\Services\AdService $service)
    {
        $ad = $service->create($request->validated(), auth()->id());

        if ($request->boolean('is_published')) {
            $service->submit($ad);
        }

        return redirect()->route('dashboard.properties.index')
            ->with('success', 'Propriété créée avec succès.');
    }

    public function editProperty($id)
    {
        $property = \App\Domains\Ads\Models\Ad::with(['details', 'amenities', 'images', 'category'])
            ->findOrFail($id);

        if ($property->user_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        return Inertia::render('dashboard/properties/EditProperties', array_merge(
            $this->getLookupData(),
            ['property' => $property]
        ));
    }

    public function updateProperty($id, \App\Domains\Ads\Requests\UpdateAdRequest $request, \App\Domains\Ads\Services\AdService $service)
    {
        $ad = \App\Domains\Ads\Models\Ad::findOrFail($id);

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

    public function showProperty($id)
    {
        $property = \App\Domains\Ads\Models\Ad::with(['details', 'amenities', 'images', 'category', 'user', 'municipality'])
            ->findOrFail($id);

        if ($property->user_id !== auth()->id() && !auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        return Inertia::render('dashboard/properties/ShowProperty', [
            'property' => $property
        ]);
    }

    public function approveProperty($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $property = \App\Domains\Ads\Models\Ad::findOrFail($id);
        $property->is_approved = !$property->is_approved;
        $property->save();

        return redirect()->back()->with('success', $property->is_approved ? 'Propriété approuvée.' : 'Approbation retirée.');
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

    public function favorites()
    {
        return Inertia::render('dashboard/properties/FavoriteProperties');
    }

    /**
     * User Management
     */
    public function users()
    {
        return Inertia::render('dashboard/users/User', [
            'users' => []
        ]);
    }

    public function profile()
    {
        return Inertia::render('dashboard/profile/Profile', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Administration
     */
    public function roles()
    {
        return Inertia::render('dashboard/roles/Roles');
    }



    public function plans(Request $request)
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
            'filters' => $request->only(['search']),
        ]);
    }

    public function storePlan(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|in:monthly,yearly',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:manual,automatic',
            'is_featured' => 'boolean',
            'highlight_homepage' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'listing_limit' => 'nullable|integer|min:0',
            'image_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
        ]);

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

    public function updatePlan(Request $request, $id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|in:monthly,yearly',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:manual,automatic',
            'is_featured' => 'boolean',
            'highlight_homepage' => 'boolean',
            'priority_support' => 'boolean',
            'analytics_access' => 'boolean',
            'listing_limit' => 'nullable|integer|min:0',
            'image_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
        ]);

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

    public function destroyPlan($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $plan = Plan::findOrFail($id);
        $plan->delete();

        return redirect()->back()->with('success', 'Plan supprimé avec succès.');
    }

    public function municipalities(Request $request)
    {
        $query = \App\Domains\Locations\Models\Municipality::query()
            ->with(['city'])
            ->withCount('properties');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $municipalities = $query->paginate(10);

        return Inertia::render('dashboard/municipalities/Municipalities', [
            'municipalities' => [
                'data' => collect($municipalities->items())->map(function($m) {
                    return [
                        'id' => $m->id,
                        'name' => $m->name,
                        'country' => 'Congo-Kinshasa',
                        'city' => $m->city?->name ?? 'Kinshasa',
                        'properties_count' => $m->properties_count,
                    ];
                }),
                'meta' => [
                    'current_page' => $municipalities->currentPage(),
                    'last_page'    => $municipalities->lastPage(),
                    'total'        => $municipalities->total(),
                    'from'         => $municipalities->firstItem(),
                    'to'           => $municipalities->lastItem(),
                ],
                'links' => $municipalities->linkCollection()->toArray(),
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    public function pages()
    {
        return Inertia::render('dashboard/pages/Pages', [
            'pages' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page'    => 1,
                    'total'        => 0,
                    'from'         => 0,
                    'to'           => 0,
                ],
                'links' => [
                    ['url' => null, 'label' => '&laquo; Précédent', 'active' => false],
                    ['url' => null, 'label' => '1', 'active' => true],
                    ['url' => null, 'label' => 'Suivant &raquo;', 'active' => false],
                ],
            ],
            'filters' => ['search' => ''],
        ]);
    }

    public function editPage($id)
    {
        return Inertia::render('dashboard/pages/PageEditor', [
            'id' => $id
        ]);
    }

    public function transactions(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }
        $query = Subscription::with(['user', 'plan'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $paymentRequests = $query->paginate(10);

        return Inertia::render('dashboard/transactions/Transactions', [
            'paymentRequests' => [
                'data' => $paymentRequests->items(),
                'meta' => [
                    'current_page' => $paymentRequests->currentPage(),
                    'last_page' => $paymentRequests->lastPage(),
                    'total' => $paymentRequests->total(),
                    'from' => $paymentRequests->firstItem(),
                    'to' => $paymentRequests->lastItem(),
                ],
                'links' => $paymentRequests->linkCollection()->toArray(),
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    public function storePaymentRequest(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'phone_number' => 'nullable|string|size:9',
            'type' => 'required|in:new,switch',
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        if ($plan->payment_method === 'automatic') {
            // For now, redirect to a fake checkout page or external gateway
            // return Inertia::location('https://payment-gateway.com/checkout?plan=' . $plan->id);
            return back()->with('info', 'Redirection vers la plateforme de paiement sécurisée...');
        }

        if (!$request->phone_number) {
            return back()->withErrors(['phone_number' => 'Le numéro de téléphone est requis pour le paiement manuel.']);
        }

        Subscription::create([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'transaction_id' => 'REQ_' . uniqid(),
            'status' => 'pending',
            'amount' => $plan->price,
            'currency' => 'USD',
            'payment_method' => 'Orange Money / M-Pesa (' . $request->phone_number . ')',
        ]);

        return back()->with('success', 'Votre demande a été envoyée avec succès.');
    }

    public function approvePaymentRequest($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $sub = Subscription::findOrFail($id);
        $sub->update([
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => now()->addMonth(), // Default 1 month, check plan for duration
        ]);

        return back()->with('success', 'Demande approuvée.');
    }

    public function rejectPaymentRequest($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $sub = Subscription::findOrFail($id);
        $sub->update(['status' => 'cancelled']);

        return back()->with('success', 'Demande rejetée.');
    }

    public function auditLogs()
    {
        return Inertia::render('dashboard/auditLog/AuditLog', [
            'logs' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page'    => 1,
                    'total'        => 0,
                    'from'         => 0,
                    'to'           => 0,
                ],
                'links' => [
                    ['url' => null, 'label' => '&laquo; Précédent', 'active' => false],
                    ['url' => null, 'label' => '1', 'active' => true],
                    ['url' => null, 'label' => 'Suivant &raquo;', 'active' => false],
                ],
            ],
        ]);
    }

    public function chatbotLogs()
    {
        return Inertia::render('dashboard/ChatbotLogs/ChatbotLogs', [
            'logs' => [
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'last_page'    => 1,
                    'total'        => 0,
                    'from'         => 0,
                    'to'           => 0,
                ],
                'links' => [
                    ['url' => null, 'label' => '&laquo; Précédent', 'active' => false],
                    ['url' => null, 'label' => '1', 'active' => true],
                    ['url' => null, 'label' => 'Suivant &raquo;', 'active' => false],
                ],
            ],
        ]);
    }

    /**
     * Settings & Others
     */
    public function settings()
    {
        return Inertia::render('dashboard/settings/Settings', [
            'user' => auth()->user(),
            'settings' => [],
            'userRoles' => auth()->user()->roles->pluck('name')->toArray(),
        ]);
    }

    public function subscriptions(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole(['admin', 'super-admin']);

        $query = Subscription::with(['user', 'plan'])
            ->orderBy('created_at', 'desc');

        if (!$isAdmin) {
            $query->where('user_id', $user->id);
        }

        if ($request->search) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $subscriptions = $query->paginate(10);

        return Inertia::render('dashboard/subscriptions/Package', [
            'subscriptions' => [
                'data' => $subscriptions->items(),
                'meta' => [
                    'current_page' => $subscriptions->currentPage(),
                    'last_page' => $subscriptions->lastPage(),
                    'total' => $subscriptions->total(),
                    'from' => $subscriptions->firstItem(),
                    'to' => $subscriptions->lastItem(),
                ],
                'links' => $subscriptions->linkCollection()->toArray(),
            ],
            'hasActiveSubscription' => $user->subscription()->where('status', 'active')->exists(),
            'currentPlan' => $user->subscription()->where('status', 'active')->first(),
            'plans' => Plan::where('is_active', true)->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function analytics()
    {
        return Inertia::render('dashboard/analytics/Index', [
            'viewsPerDay' => [],
            'contactsPerMethod' => [],
            'mostViewedProperties' => [],
            'userStats' => [
                'sellers' => User::role('seller')->count(),
                'agencies' => 0, // Placeholder for now
                'buyers' => User::role('buyer')->count(),
            ],
            'propertyStats' => [
                'total' => 0,
                'published' => 0,
                'approved' => 0,
                'featured' => 0,
            ],
            'subscriptionStats' => [
                'active' => 0,
                'expired' => 0,
                'total' => 0,
            ],
            'paymentRequestStats' => [
                'pending' => 0,
                'approved' => 0,
                'rejected' => 0,
            ],
            'isAdmin' => auth()->user()->hasRole(['admin', 'super-admin']),
        ]);
    }

    public function showAnalytics($id)
    {
        return Inertia::render('dashboard/analytics/Show', [
            'id' => $id
        ]);
    }
}

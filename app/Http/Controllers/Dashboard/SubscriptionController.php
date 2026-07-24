<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Resources\SubscriptionResource;
use App\Domains\Billing\Services\SubscriptionManager;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $subscriptionManager;

    public function __construct(SubscriptionManager $subscriptionManager)
    {
        $this->subscriptionManager = $subscriptionManager;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole(['admin', 'super-admin']);

        $filters = $request->only(['search', 'per_page']);
        if (! $isAdmin) {
            $filters['user_id'] = $user->id;
        }

        $subscriptions = $this->subscriptionManager->list($filters);

        return Inertia::render('dashboard/subscriptions/Package', [
            'subscriptions' => [
                'data' => SubscriptionResource::collection($subscriptions->items())->resolve(),
                'meta' => [
                    'current_page' => $subscriptions->currentPage(),
                    'last_page' => $subscriptions->lastPage(),
                    'total' => $subscriptions->total(),
                    'from' => $subscriptions->firstItem(),
                    'to' => $subscriptions->lastItem(),
                ],
                'links' => $subscriptions->linkCollection()->toArray(),
            ],
            'hasActiveSubscription' => $user->hasActiveSubscription(),
            'currentPlan' => $user->subscription()->first(),
            'plans' => Plan::where('is_active', true)->get(),
            'filters' => (object) $request->only(['search']),
        ]);
    }
}

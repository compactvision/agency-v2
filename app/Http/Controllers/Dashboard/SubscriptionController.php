<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\Plan;

class SubscriptionController extends Controller
{
    public function index(Request $request)
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
            'filters' => (object) $request->only(['search']),
        ]);
    }
}

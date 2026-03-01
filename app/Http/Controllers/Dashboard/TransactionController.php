<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Billing\Resources\SubscriptionResource;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\Plan;

class TransactionController extends Controller
{
    public function index(Request $request)
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
                'data' => SubscriptionResource::collection($paymentRequests->items())->resolve(),
                'meta' => [
                    'current_page' => $paymentRequests->currentPage(),
                    'last_page' => $paymentRequests->lastPage(),
                    'total' => $paymentRequests->total(),
                    'from' => $paymentRequests->firstItem(),
                    'to' => $paymentRequests->lastItem(),
                ],
                'links' => $paymentRequests->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(Request $request)
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

    public function approve($id)
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

    public function reject($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $sub = Subscription::findOrFail($id);
        $sub->update(['status' => 'cancelled']);

        return back()->with('success', 'Demande rejetée.');
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Billing\Domain\ValueObjects\BillingInterval;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Resources\SubscriptionResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Subscription::with(['user', 'plan'])
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $search = trim((string) $request->search);
            $query->where(function ($query) use ($search) {
                $query
                    ->when(
                        ctype_digit($search),
                        fn ($query) => $query->orWhereKey((int) $search),
                    )
                    ->orWhere('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
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

        if (! $request->phone_number) {
            return back()->withErrors(['phone_number' => 'Le numéro de téléphone est requis pour le paiement manuel.']);
        }

        Subscription::create([
            'user_id' => auth()->id(),
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_interval' => $plan->interval,
            'plan_features' => $plan->features()
                ->get(['name', 'value'])
                ->map(fn ($feature) => $feature->only(['name', 'value']))
                ->values()
                ->all(),
            'transaction_id' => 'REQ_'.uniqid(),
            'status' => 'pending',
            'amount' => $plan->price,
            'currency' => 'USD',
            'interval' => $plan->interval,
            'payment_method' => 'Orange Money / M-Pesa ('.$request->phone_number.')',
        ]);

        return back()->with('success', 'Votre demande a été envoyée avec succès.');
    }

    public function approve($id)
    {

        $sub = Subscription::findOrFail($id);
        $interval = BillingInterval::from(
            $sub->plan_interval ?: $sub->interval ?: $sub->plan->interval
        );
        $sub->update([
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => $interval->addTo(now()),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Demande approuvée.');
    }

    public function reject($id, Request $request)
    {

        $sub = Subscription::findOrFail($id);
        $sub->update([
            'status' => 'cancelled',
            'failure_reason' => $request->admin_note,
            'cancelled_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Demande rejetée.');
    }
}

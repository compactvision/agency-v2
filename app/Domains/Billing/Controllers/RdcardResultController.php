<?php

namespace App\Domains\Billing\Controllers;

use App\Domains\Billing\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RdcardResultController
{
    public function __invoke(Request $request)
    {
        $request->validate(['transaction' => ['required', 'string', 'max:255']]);
        $subscription = Subscription::with('plan')
            ->where('user_id', $request->user()->id)
            ->where('transaction_id', $request->input('transaction'))
            ->where('payment_method', 'RDCard')
            ->firstOrFail();

        return Inertia::render('billing/Result', [
            'payment' => [
                'status' => $subscription->status,
                'reference' => $subscription->transaction_id,
                'plan' => $subscription->plan_name ?? $subscription->plan?->name ?? 'Abonnement',
                'amount' => $subscription->amount,
                'currency' => $subscription->currency,
                'createdAt' => $subscription->created_at->toIso8601String(),
                'expiresAt' => $subscription->expires_at?->toIso8601String(),
            ],
        ]);
    }
}

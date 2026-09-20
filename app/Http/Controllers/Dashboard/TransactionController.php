<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Billing\Application\Commands\ApproveSubscriptionCommand;
use App\Domains\Billing\Application\Commands\StartAutomaticSubscriptionCommand;
use App\Domains\Billing\Application\UseCases\ApproveManualSubscription;
use App\Domains\Billing\Application\UseCases\StartAutomaticSubscription;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Resources\SubscriptionResource;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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
        abort_unless(
            $request->user()?->hasAnyRole(['seller', 'agency', 'admin']),
            403,
            'Vous devez d’abord devenir vendeur pour pouvoir souscrire un abonnement.'
        );

        abort_unless(
            $request->user()?->can('subscription.create'),
            403,
            'Vous n’êtes pas autorisé à souscrire un abonnement.'
        );

        $request->validate([
            'plan_id' => [
                'required',
                'integer',
                Rule::exists('plans', 'id')->where('is_active', true),
            ],
            'phone_number' => ['nullable', 'regex:/^\d{9}$/'],
            'type' => ['required', Rule::in(['new', 'switch'])],
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        if ($plan->payment_method === 'automatic') {
            try {
                $url = app(StartAutomaticSubscription::class)
                    ->execute(new StartAutomaticSubscriptionCommand(
                        $request->user()->id, $plan->id,
                    ));

                return Inertia::location($url);
            } catch (\Throwable $exception) {
                report($exception);

                return back()->withErrors(['plan_id' => 'Le paiement est momentanément indisponible. Veuillez réessayer.']);
            }
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

        return back()->with('success', 'Votre demande a été envoyée. Votre abonnement sera actif après validation par un administrateur.');
    }

    public function approve($id)
    {

        $this->authorize('manage', Subscription::class);
        $sub = Subscription::findOrFail($id);
        abort_if($sub->payment_method === 'RDCard', 422, 'Ce paiement est confirmé automatiquement par RDCard.');
        try {
            app(ApproveManualSubscription::class)
                ->execute(new ApproveSubscriptionCommand($sub->id, auth()->id()));
        } catch (\DomainException $exception) {
            return back()->withErrors(['subscription' => $exception->getMessage()]);
        }

        return back()->with('success', 'Demande approuvée.');
    }

    public function reject($id, Request $request)
    {

        $this->authorize('manage', Subscription::class);
        abort_if(Subscription::findOrFail($id)->payment_method === 'RDCard', 422);
        $data = $request->validate(['admin_note' => ['required', 'string', 'max:1000']]);
        $candidate = Subscription::findOrFail($id);
        DB::transaction(function () use ($id, $data, $candidate) {
            User::whereKey($candidate->user_id)->lockForUpdate()->firstOrFail();
            $sub = Subscription::whereKey($id)->lockForUpdate()->firstOrFail();
            abort_if($sub->payment_method === 'RDCard' || ! in_array($sub->status, ['pending', 'failed']), 422);
            $before = $sub->only(['status', 'failure_reason']);
            $sub->update(['status' => 'cancelled', 'failure_reason' => $data['admin_note'],
                'cancelled_at' => now(), 'approved_by' => null]);
            app(AuditLogger::class)->record('subscription.rejected', $sub, $data['admin_note'], $before, $sub->only(['status', 'failure_reason']), 'warning');
        }, 3);

        return back()->with('success', 'Demande rejetée.');
    }
}

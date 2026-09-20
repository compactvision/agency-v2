<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Requests\ManageSubscriptionRequest;
use App\Domains\Billing\Resources\PlanResource;
use App\Domains\Billing\Resources\SubscriptionResource;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Domains\Billing\Services\SubscriptionLifecycle;
use App\Domains\Billing\Services\SubscriptionManager;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $subscriptionManager;

    public function __construct(SubscriptionManager $subscriptionManager)
    {
        $this->subscriptionManager = $subscriptionManager;
    }

    public function update(ManageSubscriptionRequest $request, Subscription $subscription)
    {
        $data = $request->validated();
        $lifecycle = app(SubscriptionLifecycle::class);
        if ($data['action'] !== 'extend') {
            $lifecycle->cancel($subscription, $data['action'] === 'cancel_now', $data['reason']);
        } else {
            DB::transaction(function () use ($subscription, $data) {
                User::whereKey($subscription->user_id)->lockForUpdate()->firstOrFail();
                $sub = Subscription::whereKey($subscription->id)->lockForUpdate()->firstOrFail();
                abort_unless($sub->isActive(), 422, 'Seul un abonnement payé et actif peut être prolongé.');
                $before = $sub->only(['status', 'expires_at']);
                abort_unless(Carbon::parse($data['expires_at'])->gt($sub->expires_at), 422, 'La nouvelle échéance doit prolonger la période actuelle.');
                $sub->update(['expires_at' => Carbon::parse($data['expires_at'])->setTimezone(config('app.timezone'))]);
                app(AuditLogger::class)->record('subscription.extended', $sub, $data['reason'], $before, $sub->only(['status', 'expires_at']), 'warning');
            }, 3);
        }

        return back()->with('success', 'Abonnement mis à jour et action journalisée.');
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole(['admin', 'super-admin']);

        $filters = $request->only(['search', 'per_page', 'status']);
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
            'plans' => PlanResource::collection(
                Plan::with('features')
                    ->where('is_active', true)
                    ->orderBy('position')
                    ->get()
            )->resolve(),
            'filters' => (object) $request->only(['search', 'status']),
            'subscriptionSummary' => app(SubscriptionEntitlements::class)->summary($user->id),
            'isAdmin' => $isAdmin,
        ]);
    }
}

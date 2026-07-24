<?php

use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\StatusUpdater;
use App\Models\User;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    Event::fake();
    config(['billing.acoriss.webhook_amount_multiplier' => 100]);
});

function createPaymentPlan(): Plan
{
    return Plan::create([
        'name' => 'Secure plan',
        'price' => 50,
        'interval' => 'monthly',
        'is_active' => true,
        'position' => 1,
    ]);
}

function createPendingSubscription(User $user, Plan $plan, string $transactionId): Subscription
{
    return Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'transaction_id' => $transactionId,
        'status' => 'pending',
        'amount' => 50,
        'currency' => 'USD',
    ]);
}

test('a successful payment activates a subscription exactly once', function () {
    $user = User::factory()->create();
    $subscription = createPendingSubscription($user, createPaymentPlan(), 'secure-transaction');
    $event = [
        'data' => [
            'transactionId' => 'secure-transaction',
            'paymentId' => 'secure-payment',
            'amount' => 5000,
            'currency' => 'usd',
            'paymentMethod' => 'card',
        ],
    ];

    app(StatusUpdater::class)->paymentSucceeded($event);
    $firstExpiry = $subscription->fresh()->expires_at;

    app(StatusUpdater::class)->paymentSucceeded($event);

    expect($subscription->fresh())
        ->status->toBe('active')
        ->payment_id->toBe('secure-payment')
        ->and($subscription->fresh()->expires_at->equalTo($firstExpiry))->toBeTrue();
});

test('a payment with a mismatched amount or currency is rejected', function () {
    $user = User::factory()->create();
    $subscription = createPendingSubscription($user, createPaymentPlan(), 'mismatched-transaction');

    expect(fn () => app(StatusUpdater::class)->paymentSucceeded([
        'data' => [
            'transactionId' => 'mismatched-transaction',
            'paymentId' => 'mismatched-payment',
            'amount' => 100,
            'currency' => 'CDF',
        ],
    ]))->toThrow(DomainException::class);

    expect($subscription->fresh()->status)->toBe('pending');
});

test('one payment cannot activate two subscriptions', function () {
    $user = User::factory()->create();
    $plan = createPaymentPlan();
    $first = createPendingSubscription($user, $plan, 'first-transaction');
    $second = createPendingSubscription($user, $plan, 'second-transaction');
    $first->update(['status' => 'active', 'payment_id' => 'replayed-payment']);

    expect(fn () => app(StatusUpdater::class)->paymentSucceeded([
        'data' => [
            'transactionId' => 'second-transaction',
            'paymentId' => 'replayed-payment',
            'amount' => 5000,
            'currency' => 'USD',
        ],
    ]))->toThrow(DomainException::class);

    expect($second->fresh()->status)->toBe('pending');
});

test('starting another checkout preserves subscription history', function () {
    $user = User::factory()->create();
    $plan = createPaymentPlan();
    $repository = app(SubscriptionRepository::class);

    $repository->createPending($user->id, $plan);
    $repository->createPending($user->id, $plan);

    expect(Subscription::where('user_id', $user->id)->count())->toBe(2);
});

<?php

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\WebhookLog;
use App\Domains\Billing\Services\BillingService;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'billing.rdcard.base_url' => 'https://checkout.rdcard.net/api',
        'billing.rdcard.api_key' => 'test-key',
        'billing.rdcard.secret' => 'test-secret',
    ]);
    Http::preventStrayRequests();
    $this->seed(RolePermissionSeeder::class);
    $this->seller = User::factory()->create();
    $this->seller->assignRole('seller');
    Event::fake();
    $this->plan = Plan::create([
        'name' => 'Abonnement RDCard', 'price' => 25.99,
        'payment_method' => 'automatic', 'interval' => 'monthly',
        'is_active' => true, 'position' => 1,
    ]);
});

function rdcardSubscription($test): Subscription
{
    return Subscription::create([
        'user_id' => $test->seller->id, 'plan_id' => $test->plan->id,
        'transaction_id' => 'tx-rdcard', 'payment_session_id' => 'pay-test',
        'payment_method' => 'RDCard', 'status' => 'pending',
        'amount' => 25.99, 'currency' => 'USD',
    ]);
}

function rdcardPayload(string $type = 'payment.succeeded', array $overrides = []): array
{
    return [
        'id' => 'evt-test', 'type' => $type,
        'data' => ['payment' => array_merge([
            'id' => 'pay-test', 'transactionId' => 'tx-rdcard',
            'amount' => 25.99, 'currency' => 'USD',
            'customer' => ['email' => 'private@example.com'],
        ], $overrides)],
    ];
}

function postRdcardWebhook($test, array $event, ?string $signature = null)
{
    $body = json_encode($event, JSON_THROW_ON_ERROR);

    return $test->call('POST', '/api/webhooks/rdcard', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_X_SIGNATURE' => $signature ?? hash_hmac('sha256', $body, 'test-secret'),
    ], $body);
}

test('dashboard automatic checkout sends signed dollar amounts and redirects to RDCard', function () {
    Http::fake(['*/v1/sessions' => Http::response([
        'id' => 'pay-test', 'checkoutUrl' => 'https://checkout.rdcard.net/sessions/pay-test',
    ])]);
    $this->actingAs($this->seller)->withHeader('X-Inertia', 'true')
        ->post(route('dashboard.subscriptions.store'), ['plan_id' => $this->plan->id, 'type' => 'new'])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout.rdcard.net/sessions/pay-test');
    $sub = Subscription::sole();
    expect($sub->status)->toBe('pending')->and($sub->payment_session_id)->toBe('pay-test');
    Http::assertSent(fn ($request) => $request->method() === 'POST'
        && $request->hasHeader('X-API-KEY', 'test-key')
        && $request->hasHeader('X-SIGNATURE', hash_hmac('sha256', $request->body(), 'test-secret'))
        && strlen($request['transactionId']) <= 50
        && $request['customer']['email'] === $this->seller->email
        && $request['amount'] === 25.99 && $request['services'][0]['price'] === 25.99
        && $request['callbackUrl'] === route('webhooks.rdcard')
        && $request['cancelUrl'] === route('billing.cancel.return', ['transaction' => $sub->transaction_id])
        && $request['redirectUrl'] === $request['successUrl']
        && str_contains($request['successUrl'], $sub->transaction_id));
});

test('billing service also starts RDCard checkout', function () {
    Http::fake(['*/v1/sessions' => Http::response([
        'id' => 'pay-test', 'checkoutUrl' => 'https://checkout.rdcard.net/sessions/pay-test',
    ])]);
    $result = app(BillingService::class)->startSubscription($this->seller->id, $this->plan->id);
    expect($result['status'])->toBe('automatic_redirect');
    expect(Subscription::sole()->payment_session_id)->toBe('pay-test');
});

test('missing credentials do not break manual payments and automatic errors are visible', function () {
    config(['billing.rdcard.api_key' => null, 'billing.rdcard.secret' => null]);
    $this->actingAs($this->seller)->post(route('dashboard.subscriptions.store'), [
        'plan_id' => $this->plan->id, 'type' => 'new',
    ])->assertSessionHasErrors('plan_id');
    $this->plan->update(['payment_method' => 'manual']);
    $result = app(BillingService::class)->startSubscription($this->seller->id, $this->plan->id);
    expect($result['status'])->toBe('manual_pending');
    Http::assertNothingSent();
});

test('provider failures never activate the subscription', function () {
    Http::fake(['*' => Http::response(['error' => 'private upstream details'], 500)]);
    $this->actingAs($this->seller)->post(route('dashboard.subscriptions.store'), [
        'plan_id' => $this->plan->id, 'type' => 'new',
    ])->assertSessionHasErrors('plan_id');
    expect(Subscription::sole()->status)->toBe('pending');
});

test('signed nested webhook activates once and excludes customer details from logs', function () {
    $sub = rdcardSubscription($this);
    postRdcardWebhook($this, rdcardPayload())->assertOk();
    $expiry = $sub->fresh()->expires_at;
    postRdcardWebhook($this, rdcardPayload())->assertOk();
    postRdcardWebhook($this, rdcardPayload('payment.failed'))->assertOk();
    postRdcardWebhook($this, rdcardPayload('payment.initialized'))->assertOk();
    expect($sub->fresh()->status)->toBe('active');
    expect($sub->fresh()->expires_at->equalTo($expiry))->toBeTrue();
    expect(WebhookLog::first()->payload['data']['payment'])->not->toHaveKey('customer');
});

test('invalid signature or mismatched payment cannot activate', function (array $overrides) {
    $sub = rdcardSubscription($this);
    postRdcardWebhook($this, rdcardPayload(), 'invalid')->assertUnauthorized();
    postRdcardWebhook($this, rdcardPayload('payment.succeeded', $overrides))->assertStatus(422);
    expect($sub->fresh()->status)->toBe('pending');
})->with([
    'amount' => [['amount' => 25.98]],
    'fractional amount' => [['amount' => 25.991]],
    'currency' => [['currency' => 'CDF']],
    'another session' => [['id' => 'pay-other']],
]);

test('failed or cancelled attempts may be retried successfully', function (string $event) {
    $sub = rdcardSubscription($this);
    postRdcardWebhook($this, rdcardPayload($event))->assertOk();
    expect($sub->fresh()->status)->toBe($event === 'payment.canceled' ? 'cancelled' : 'failed');
    postRdcardWebhook($this, rdcardPayload())->assertOk();
    expect($sub->fresh()->status)->toBe('active');
})->with(['payment.failed', 'payment.canceled']);

test('return checks RDCard server status and ignores browser success claims', function (string $status, string $expected) {
    $sub = rdcardSubscription($this);
    Http::fake(['*/v1/sessions/pay-test' => Http::response([
        ...rdcardPayload()['data']['payment'], 'status' => $status,
    ])]);
    $this->actingAs($this->seller)->get(route('billing.return', [
        'transaction' => $sub->transaction_id, 'status' => 'S',
    ]))->assertRedirect(route('billing.result', ['transaction' => $sub->transaction_id]));
    expect($sub->fresh()->status)->toBe($expected);
    Http::assertSent(fn ($request) => $request->method() === 'GET'
        && $request->body() === ''
        && $request->hasHeader('X-SIGNATURE', hash_hmac('sha256', 'pay-test', 'test-secret')));
})->with([['P', 'pending'], ['S', 'active'], ['C', 'cancelled']]);

test('another user cannot access a payment return', function () {
    $sub = rdcardSubscription($this);
    $this->actingAs(User::factory()->create())->get(route('billing.return', [
        'transaction' => $sub->transaction_id,
    ]))->assertNotFound();
    Http::assertNothingSent();
});

test('a callback arriving before the session is stored requests a retry', function () {
    $sub = rdcardSubscription($this);
    $sub->update(['payment_session_id' => null]);
    postRdcardWebhook($this, rdcardPayload())->assertStatus(503);
    expect($sub->fresh()->status)->toBe('pending');
});

test('administrators cannot manually approve or reject an RDCard payment', function () {
    $sub = rdcardSubscription($this);
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)->put(route('dashboard.payment-requests.approve', $sub))->assertStatus(422);
    $this->actingAs($admin)->put(route('dashboard.payment-requests.reject', $sub))->assertStatus(422);
    expect($sub->fresh()->status)->toBe('pending');
});

test('legacy webhook cannot bypass RDCard session verification', function () {
    $sub = rdcardSubscription($this);
    config(['billing.acoriss.webhook_secret' => 'legacy-secret']);
    $body = json_encode(['type' => 'payment.succeeded', 'data' => [
        'transactionId' => $sub->transaction_id, 'paymentId' => 'another-payment',
        'amount' => 25.99, 'currency' => 'USD',
    ]]);
    $this->call('POST', '/api/webhooks/acoriss', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_X_ACORISS_SIGNATURE' => hash_hmac('sha256', $body, 'legacy-secret'),
    ], $body)->assertStatus(422);
    expect($sub->fresh()->status)->toBe('pending');
});

test('unsafe or incomplete checkout responses are rejected', function (array $response) {
    Http::fake(['*' => Http::response($response)]);
    $this->actingAs($this->seller)->post(route('dashboard.subscriptions.store'), [
        'plan_id' => $this->plan->id, 'type' => 'new',
    ])->assertSessionHasErrors('plan_id');
    expect(Subscription::sole()->payment_session_id)->toBeNull();
})->with([
    [['id' => 'pay-test', 'checkoutUrl' => 'https://other.example/pay']],
    [['checkoutUrl' => 'https://checkout.rdcard.net/sessions/pay-test']],
]);

test('pricing check access returns the checkout URL expected by the frontend', function () {
    Http::fake(['*/v1/sessions' => Http::response([
        'id' => 'pay-test', 'checkoutUrl' => 'https://checkout.rdcard.net/sessions/pay-test',
    ])]);

    $this->actingAs($this->seller)->postJson(route('subscriptions.checkAccess'), [
        'plan_id' => $this->plan->id,
    ])->assertCreated()
        ->assertJsonPath('data.status', 'automatic_redirect')
        ->assertJsonPath('data.checkoutUrl', 'https://checkout.rdcard.net/sessions/pay-test')
        ->assertJsonPath('data.checkout_url', 'https://checkout.rdcard.net/sessions/pay-test');
});

test('RDCard environment selects the matching API and accepts its checkout host', function (string $environment, string $host) {
    config(['billing.rdcard.base_url' => null, 'billing.rdcard.environment' => $environment]);
    Http::fake(["https://{$host}/api/v1/sessions" => Http::response([
        'id' => 'pay-test', 'checkoutUrl' => "https://{$host}/sessions/pay-test",
    ])]);
    $this->actingAs($this->seller)->postJson(route('subscriptions.checkAccess'), [
        'plan_id' => $this->plan->id,
    ])->assertCreated()->assertJsonPath('data.checkoutUrl', "https://{$host}/sessions/pay-test");

    Http::assertSent(fn ($request) => $request->url() === "https://{$host}/api/v1/sessions");
})->with([
    ['sandbox', 'sandbox.checkout.rdcard.net'],
    ['live', 'checkout.rdcard.net'],
]);

test('pricing receives a safe actionable error when the gateway rejects a session', function () {
    Http::fake(['*' => Http::response(['message' => 'private upstream detail'], 401)]);
    $this->actingAs($this->seller)->postJson(route('subscriptions.checkAccess'), [
        'plan_id' => $this->plan->id,
    ])->assertStatus(503)
        ->assertJsonPath('error_code', 'START_PAYMENT_ERROR')
        ->assertJsonPath('message', 'Le paiement est momentanément indisponible. Veuillez réessayer.')
        ->assertDontSee('private upstream detail');
    expect(Subscription::sole()->status)->toBe('pending');
});

test('a fifteen dollar plan sends fifteen dollars through both checkout entry points', function (string $entryPoint) {
    $this->plan->update(['price' => 15]);
    Http::fake(['*/v1/sessions' => Http::response([
        'id' => 'pay-test', 'checkoutUrl' => 'https://checkout.rdcard.net/sessions/pay-test',
    ])]);

    if ($entryPoint === 'pricing') {
        $this->actingAs($this->seller)->postJson(route('subscriptions.checkAccess'), [
            'plan_id' => $this->plan->id,
        ])->assertCreated();
    } else {
        $this->actingAs($this->seller)->withHeader('X-Inertia', 'true')
            ->post(route('dashboard.subscriptions.store'), [
                'plan_id' => $this->plan->id, 'type' => 'new',
            ])->assertStatus(409);
    }

    Http::assertSent(fn ($request) => (float) $request['amount'] === 15.0
        && (float) $request['services'][0]['price'] === 15.0);

    $sub = Subscription::sole();
    postRdcardWebhook($this, rdcardPayload('payment.succeeded', [
        'transactionId' => $sub->transaction_id, 'amount' => 1500,
    ]))->assertStatus(422);
    expect($sub->fresh()->status)->toBe('pending');

    postRdcardWebhook($this, rdcardPayload('payment.succeeded', [
        'transactionId' => $sub->transaction_id, 'amount' => 15,
    ]))->assertOk();
    expect($sub->fresh()->status)->toBe('active');
})->with(['pricing', 'dashboard']);

test('cancellation return closes the attempt even when provider status is pending or unavailable', function (string $entry, bool $unavailable) {
    $sub = rdcardSubscription($this);
    Http::fake(['*' => $unavailable
        ? Http::response([], 503)
        : Http::response([...rdcardPayload()['data']['payment'], 'status' => 'P'])]);
    $parameters = ['transaction' => $sub->transaction_id];
    if ($entry === 'billing.return') {
        $parameters['cancelled'] = 1;
    }

    $this->actingAs($this->seller)->get(route($entry, $parameters))
        ->assertRedirect(route('billing.result', ['transaction' => $sub->transaction_id]));
    expect($sub->fresh())->status->toBe('cancelled')->cancelled_at->not->toBeNull();

    // Delayed initialization/failure must not undo the cancellation.
    postRdcardWebhook($this, rdcardPayload('payment.initialized'))->assertOk();
    postRdcardWebhook($this, rdcardPayload('payment.failed'))->assertOk();
    expect($sub->fresh()->status)->toBe('cancelled');

    // The transaction list receives the same cancelled status.
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)->get(route('dashboard.payment-requests.index'))
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/transactions/Transactions')
            ->where('paymentRequests.data.0.status', 'cancelled'));

    // A verified success arriving later must still credit the customer.
    postRdcardWebhook($this, rdcardPayload())->assertOk();
    expect($sub->fresh())->status->toBe('active')->cancelled_at->toBeNull();
})->with(['billing.cancel.return', 'billing.return'])->with([false, true]);

test('cancellation cannot overwrite a confirmed payment', function (bool $alreadyConfirmed) {
    $sub = rdcardSubscription($this);
    if ($alreadyConfirmed) {
        postRdcardWebhook($this, rdcardPayload())->assertOk();
    }
    Http::fake(['*' => Http::response([
        ...rdcardPayload()['data']['payment'], 'status' => $alreadyConfirmed ? 'P' : 'S',
    ])]);
    $this->actingAs($this->seller)->get(route('billing.cancel.return', ['transaction' => $sub->transaction_id]))
        ->assertRedirect(route('billing.result', ['transaction' => $sub->transaction_id]));
    postRdcardWebhook($this, rdcardPayload('payment.canceled'))->assertOk();
    expect($sub->fresh())->status->toBe('active')->cancelled_at->toBeNull();
})->with([false, true]);

test('cancellation return requires the owner of the RDCard attempt', function () {
    $sub = rdcardSubscription($this);
    $url = route('billing.cancel.return', ['transaction' => $sub->transaction_id]);
    $this->get($url)->assertRedirect(route('login'));
    $this->actingAs(User::factory()->create())->get($url)->assertNotFound();
    $sub->update(['payment_method' => 'manual']);
    $this->actingAs($this->seller)->get($url)->assertNotFound();
    expect($sub->fresh()->status)->toBe('pending');
    Http::assertNothingSent();
});

test('payment result shows only the stored status and the owners payment summary', function (string $status) {
    $sub = rdcardSubscription($this);
    $sub->update(['status' => $status]);
    $url = route('billing.result', ['transaction' => $sub->transaction_id, 'status' => 'active']);
    $this->get($url)->assertRedirect(route('login'));
    $this->actingAs(User::factory()->create())->get($url)->assertNotFound();
    $response = $this->actingAs($this->seller)->get($url);
    $response->assertOk()->assertInertia(fn ($page) => $page
        ->component('billing/Result')
        ->where('payment.status', $status)
        ->where('payment.reference', $sub->transaction_id)
        ->where('payment.plan', $this->plan->name)
        ->where('payment.amount', '25.99')
        ->missing('payment.payment_session_id'));
    Http::assertNothingSent();
})->with(['active', 'cancelled', 'pending', 'failed']);

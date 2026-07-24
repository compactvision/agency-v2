<?php

use App\Domains\Billing\Models\WebhookLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    config([
        'billing.acoriss.webhook_secret' => 'test-webhook-secret',
        'billing.acoriss.webhook_signature_header' => 'X-Acoriss-Signature',
    ]);
});

test('acoriss webhook rejects requests without a signature', function () {
    $this->postJson('/api/webhooks/acoriss', [
        'type' => 'payment.succeeded',
        'data' => ['transactionId' => 'forged-transaction'],
    ])->assertUnauthorized();

    expect(WebhookLog::count())->toBe(0);
});

test('acoriss webhook rejects an invalid signature', function () {
    $payload = json_encode([
        'type' => 'payment.succeeded',
        'data' => ['transactionId' => 'forged-transaction'],
    ], JSON_THROW_ON_ERROR);

    $this->call(
        'POST',
        '/api/webhooks/acoriss',
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ACORISS_SIGNATURE' => 'invalid',
        ],
        $payload,
    )->assertUnauthorized();

    expect(WebhookLog::count())->toBe(0);
});

test('acoriss webhook accepts a valid hmac signature and redacts sensitive data', function () {
    $payload = json_encode([
        'type' => 'unhandled.event',
        'data' => [
            'transactionId' => 'safe-transaction',
            'token' => 'must-not-be-logged',
        ],
    ], JSON_THROW_ON_ERROR);

    $signature = hash_hmac('sha256', $payload, 'test-webhook-secret');

    $this->call(
        'POST',
        '/api/webhooks/acoriss',
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_ACORISS_SIGNATURE' => "sha256={$signature}",
        ],
        $payload,
    )->assertOk()->assertJson(['ignored' => true]);

    $log = WebhookLog::sole();

    expect($log->payload['data'])
        ->toHaveKey('transactionId', 'safe-transaction')
        ->not->toHaveKey('token');
    expect($log->headers)->not->toHaveKey('x-acoriss-signature');
});

test('payment mock routes are unavailable outside the local environment', function () {
    $this->postJson('/api/mock/checkout/create-session')
        ->assertNotFound();
});

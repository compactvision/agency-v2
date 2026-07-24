<?php

use App\Models\User;
use Illuminate\Support\Facades\URL;

test('api email verification rejects unsigned links', function () {
    $user = User::factory()->unverified()->create();

    $this->getJson(route('api.verification.verify', [
        'id' => $user->id,
        'hash' => sha1($user->email),
    ]))->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('api email verification accepts a valid signed link', function () {
    $user = User::factory()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'api.verification.verify',
        now()->addMinutes(30),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    $this->getJson($url)->assertOk();

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

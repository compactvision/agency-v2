<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('web registration does not create an unused api token', function () {
    $this->post(route('register.store'), [
        'name' => 'Web User',
        'email' => 'web-user@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect();

    $user = User::where('email', 'web-user@example.com')->sole();

    expect($user->tokens()->count())->toBe(0);
});

test('api login rotates previous authentication tokens', function () {
    $user = User::factory()->create(['email' => 'api-user@example.com']);
    $user->createToken('auth_token');

    $credentials = [
        'email' => 'api-user@example.com',
        'password' => 'password',
    ];

    $this->postJson('/api/auth/login', $credentials)->assertOk();
    $this->postJson('/api/auth/login', $credentials)->assertOk();

    expect($user->tokens()->where('name', 'auth_token')->count())->toBe(1);
});

test('changing a password revokes api tokens', function () {
    $user = User::factory()->create();
    $user->createToken('auth_token');

    $this->actingAs($user)
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])
        ->assertRedirect();

    expect($user->tokens()->count())->toBe(0);
});

test('password recovery does not reveal whether an account exists', function () {
    $response = $this->postJson('/api/auth/password/forgot', [
        'email' => 'missing@example.com',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'If an account exists for this email, a reset link has been sent.');
});

test('profile uploads reject svg files', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('profile-photo.update'), [
            'profile_photo' => UploadedFile::fake()->create(
                'avatar.svg',
                10,
                'image/svg+xml',
            ),
        ])
        ->assertSessionHasErrors('profile_photo');

    expect(Storage::disk('public')->allFiles())->toBeEmpty();
});

test('profile social links reject executable protocols', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'facebook' => 'javascript:alert(1)',
        ])
        ->assertSessionHasErrors('facebook');
});

test('responses include baseline browser security headers', function () {
    $this->get('/')
        ->assertOk()
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
        ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});

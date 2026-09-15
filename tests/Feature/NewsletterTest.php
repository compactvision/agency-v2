<?php

use App\Models\NewsletterSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config(['services.brevo.api_key' => 'test-key', 'services.brevo.newsletter_list_id' => 42, 'services.brevo.sender_email' => 'contact@agencydrc.com', 'services.brevo.sender_name' => 'The Agency']);
    Http::preventStrayRequests();
});

test('newsletter sends a normalized contact to Brevo before confirming', function () {
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response(['id' => 123], 201),
    ]);

    $this->from('/')->post(route('newsletter.subscribe'), ['email' => ' Reader@Example.com '])
        ->assertRedirect('/')->assertSessionHasNoErrors()->assertSessionHas('success');

    Http::assertSent(fn ($request) => $request->url() === 'https://api.brevo.com/v3/contacts'
        && $request->hasHeader('api-key', 'test-key')
        && $request['email'] === 'reader@example.com'
        && $request['listIds'] === [42]
        && $request['updateEnabled'] === true
        && ! isset($request['emailBlacklisted']));
    $this->assertDatabaseHas('newsletter_subscriptions', ['email' => 'reader@example.com', 'is_active' => true]);
});

test('existing subscribers are updated without losing their user link', function () {
    $user = User::factory()->create();
    NewsletterSubscription::create(['email' => $user->email, 'user_id' => $user->id, 'is_active' => true]);
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response('', 204),
    ]);

    $this->post(route('newsletter.subscribe'), ['email' => $user->email])->assertSessionHasNoErrors();

    $this->assertDatabaseCount('newsletter_subscriptions', 1);
    $this->assertDatabaseHas('newsletter_subscriptions', ['email' => $user->email, 'user_id' => $user->id]);
});

test('Brevo errors never confirm or save a new subscription', function (int $status) {
    Http::fake(['api.brevo.com/*' => Http::response([], $status)]);

    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])
        ->assertSessionHasErrors('email')->assertSessionMissing('success');
    $this->assertDatabaseCount('newsletter_subscriptions', 0);
})->with([400, 401, 429, 500]);

test('connection failures are shown as form errors', function () {
    Http::fake(['api.brevo.com/*' => Http::failedConnection()]);
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])
        ->assertSessionHasErrors('email');
    $this->assertDatabaseCount('newsletter_subscriptions', 0);
});

test('missing configuration prevents a false success', function () {
    config(['services.brevo.api_key' => null]);
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])
        ->assertSessionHasErrors('email');
    Http::assertNothingSent();
    $this->assertDatabaseCount('newsletter_subscriptions', 0);
});

test('invalid emails never reach Brevo', function () {
    $this->post(route('newsletter.subscribe'), ['email' => ['invalid']])->assertSessionHasErrors('email');
    Http::assertNothingSent();
});

test('profile newsletter preference subscribes and unsubscribes in Brevo', function () {
    $user = User::factory()->create();
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response('', 204),
    ]);

    $this->actingAs($user)->patch(route('profile.update'), [
        'name' => $user->name, 'email' => $user->email, 'newsletter' => true,
    ])->assertSessionHasNoErrors();
    $this->assertDatabaseHas('newsletter_subscriptions', ['user_id' => $user->id, 'is_active' => true]);

    $this->patch(route('profile.update'), [
        'name' => $user->name, 'email' => $user->email, 'newsletter' => false,
    ])->assertSessionHasNoErrors();
    Http::assertSent(fn ($request) => $request->method() === 'PUT' && $request['unlinkListIds'] === [42]);
    $this->assertDatabaseHas('newsletter_subscriptions', ['user_id' => $user->id, 'is_active' => false]);
});

test('failed profile subscription does not save preferences or confirm success', function () {
    $user = User::factory()->create();
    Http::fake(['api.brevo.com/*' => Http::response([], 503)]);
    $this->actingAs($user)->patch(route('profile.update'), [
        'name' => 'Changed', 'email' => $user->email, 'newsletter' => true,
    ])->assertSessionHasErrors('newsletter')->assertSessionMissing('success');
    expect($user->fresh()->name)->toBe($user->name);
    $this->assertDatabaseCount('newsletter_subscriptions', 0);
});

test('saving unchanged newsletter preferences does not re-add a Brevo unsubscribe', function () {
    $user = User::factory()->create();
    NewsletterSubscription::create(['email' => $user->email, 'user_id' => $user->id, 'is_active' => true, 'welcome_sent_at' => now()]);

    $this->actingAs($user)->patch(route('profile.update'), [
        'name' => $user->name, 'email' => $user->email, 'newsletter' => true,
    ])->assertSessionHasNoErrors();
    Http::assertNothingSent();
});

test('changing a subscribed email removes the old address from Brevo', function () {
    $user = User::factory()->create();
    $oldEmail = $user->email;
    NewsletterSubscription::create(['email' => $user->email, 'user_id' => $user->id, 'is_active' => true]);
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response('', 204),
    ]);
    $this->actingAs($user)->patch(route('profile.update'), [
        'name' => $user->name, 'email' => 'new@example.com',
    ])->assertSessionHasNoErrors();

    Http::assertSent(fn ($request) => $request->method() === 'PUT'
        && $request->url() === 'https://api.brevo.com/v3/contacts/'.rawurlencode($oldEmail));
    $this->assertDatabaseHas('newsletter_subscriptions', ['email' => $oldEmail, 'user_id' => null, 'is_active' => false]);
    $this->assertDatabaseHas('newsletter_subscriptions', ['email' => 'new@example.com', 'user_id' => $user->id, 'is_active' => true]);
});

test('existing contact import only sends active subscribers', function () {
    NewsletterSubscription::create(['email' => 'active@example.com', 'is_active' => true]);
    NewsletterSubscription::create(['email' => 'inactive@example.com', 'is_active' => false]);
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response('', 204),
    ]);

    $this->artisan('newsletter:sync-brevo')->assertSuccessful();
    Http::assertSentCount(1);
    Http::assertSent(fn ($request) => $request['email'] === 'active@example.com');
});

test('account deletion removes its active newsletter address from Brevo', function () {
    $user = User::factory()->create();
    $email = $user->email;
    NewsletterSubscription::create(['email' => $email, 'user_id' => $user->id, 'is_active' => true]);
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/*' => Http::response('', 204),
    ]);

    $this->actingAs($user)->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertSessionHasNoErrors()->assertRedirect('/');
    Http::assertSent(fn ($request) => $request->method() === 'PUT'
        && $request->url() === 'https://api.brevo.com/v3/contacts/'.rawurlencode($email));
    expect($user->fresh()->anonymized_at)->not->toBeNull();
});

test('failed Brevo removal preserves the account and session', function () {
    $user = User::factory()->create();
    NewsletterSubscription::create(['email' => $user->email, 'user_id' => $user->id, 'is_active' => true]);
    Http::fake(['api.brevo.com/*' => Http::response([], 503)]);

    $this->actingAs($user)->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertSessionHasErrors('newsletter');
    expect($user->fresh()->anonymized_at)->toBeNull();
    $this->assertAuthenticatedAs($user);
});

test('newsletter sends a branded welcome once through Brevo', function () {
    Http::fake([
        'api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'welcome-123'], 201),
        'api.brevo.com/v3/contacts' => Http::response('', 204),
    ]);

    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])->assertSessionHasNoErrors();
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])->assertSessionHasNoErrors();

    Http::assertSent(fn ($request) => $request->url() === 'https://api.brevo.com/v3/smtp/email'
        && $request['sender'] === ['name' => 'The Agency', 'email' => 'contact@agencydrc.com']
        && $request['to'] === [['email' => 'reader@example.com']]
        && $request['subject'] === 'Bienvenue dans la newsletter de The Agency !'
        && str_contains($request['htmlContent'], 'Merci pour votre inscription.')
        && str_contains($request['textContent'], 'L’équipe The Agency'));
    Http::assertSentCount(3); // Two contact updates, one welcome email.
    expect(NewsletterSubscription::first()->welcome_sent_at)->not->toBeNull();
});

test('failed welcome delivery can be retried without losing the subscription', function () {
    Http::fake([
        'api.brevo.com/v3/contacts' => Http::response('', 204),
        'api.brevo.com/v3/smtp/email' => Http::sequence()
            ->push(['code' => 'invalid_parameter'], 400)
            ->push(['messageId' => 'welcome-retry'], 201),
    ]);

    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])
        ->assertSessionHasErrors('email')->assertSessionMissing('success');
    expect(NewsletterSubscription::first())->is_active->toBeTrue()->welcome_sent_at->toBeNull();

    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])->assertSessionHasNoErrors();
    expect(NewsletterSubscription::first()->welcome_sent_at)->not->toBeNull();
    $this->assertDatabaseCount('newsletter_subscriptions', 1);
});

test('welcome is not marked sent without a Brevo message identifier', function () {
    Http::fake(['api.brevo.com/*' => Http::response('', 204)]);
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])->assertSessionHasErrors('email');
    expect(NewsletterSubscription::first()->welcome_sent_at)->toBeNull();
});

test('invalid welcome sender preserves the subscription and reports the delivery failure', function () {
    config(['services.brevo.sender_email' => null]);
    Http::fake(['api.brevo.com/v3/contacts' => Http::response('', 204)]);
    $this->post(route('newsletter.subscribe'), ['email' => 'reader@example.com'])->assertSessionHasErrors('email');
    expect(NewsletterSubscription::first())->is_active->toBeTrue()->welcome_sent_at->toBeNull();
    Http::assertSentCount(1);
});

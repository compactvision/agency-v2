<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Services\AdService;
use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionNotice;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionLifecycleMail;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\SubscriptionNotice;
use App\Domains\Billing\Services\StatusUpdater;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Domains\Billing\Services\SubscriptionLifecycle;
use App\Domains\Categories\Models\Category;
use App\Models\AuditLog;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    Mail::fake();
    Queue::fake();
    $this->travelTo(now()->startOfSecond());
    $this->owner = User::factory()->create(['notifications_enabled' => true]);
    $this->sub = grantTestPublicationRights($this->owner, '3');
    $this->lifecycle = app(SubscriptionLifecycle::class);
});

function lifecycleAd(User $owner, array $changes = []): Ad
{
    $category = Category::firstOrCreate(['id' => 1], ['name' => 'Maison', 'slug' => 'house', 'is_active' => true]);
    $ad = Ad::create(array_merge([
        'user_id' => $owner->id, 'category_id' => $category->id,
        'title' => 'Maison', 'price' => 1000, 'currency' => 'USD', 'ad_type' => 'sale',
        'reference' => (string) Str::uuid(), 'status' => 'published', 'is_approved' => true, 'is_published' => true,
    ], $changes));
    $ad->details()->create(['details' => ['bedrooms' => 2, 'bathrooms' => 1, 'kitchens' => 1]]);

    return $ad;
}

function lifecycleRenew(Subscription $old, string $limit = '3'): Subscription
{
    $plan = $old->plan;
    $sub = app(SubscriptionRepository::class)->createPending($old->user_id, $plan);
    $sub->update(['plan_features' => [['name' => 'Listings per month', 'value' => $limit]]]);
    app(ActivateSubscription::class)->execute($sub->id, ['paymentId' => (string) Str::uuid(), 'paymentMethod' => 'test-confirmed']);

    return $sub->fresh();
}

function sendLifecycleNotices(): void
{
    SubscriptionNotice::all()->each(fn ($notice) => (new SendSubscriptionNotice($notice->id))->handle(app(SubscriptionEntitlements::class)));
}

test('unpaid pending future and incoherent subscriptions never grant rights', function ($changes) {
    $this->sub->update($changes);
    expect($this->sub->fresh()->isActive())->toBeFalse()
        ->and($this->owner->fresh()->hasActiveSubscription())->toBeFalse();
    $ad = lifecycleAd($this->owner, ['status' => 'draft', 'is_published' => false, 'is_approved' => false]);
    expect(fn () => app(AdService::class)->submit($ad))->toThrow(ValidationException::class);
})->with([
    'pending' => [['status' => 'pending']], 'failed' => [['status' => 'failed']],
    'no payment' => [['payment_id' => null]], 'no end' => [['expires_at' => null]],
    'no start' => [['started_at' => null]], 'future' => [['started_at' => now()->addWeek()]],
    'expired active' => [['expires_at' => now()->subDay()]],
]);

test('no subscription blocks approval and owner updates cannot bypass it', function () {
    $this->sub->delete();
    $pending = lifecycleAd($this->owner, ['status' => 'pending_validation', 'is_approved' => false]);
    expect(fn () => app(AdService::class)->approve($pending))->toThrow(ValidationException::class);
    $ad = lifecycleAd($this->owner, ['is_published' => false]);
    $this->actingAs($this->owner)->put(route('dashboard.properties.update', $ad), ['is_published' => true])
        ->assertSessionHasErrors('is_published');
    expect($ad->fresh()->is_published)->toBe(0);
});

test('paid publication counts all active listings regardless of month and enforces the exact limit', function () {
    for ($i = 0; $i < 3; $i++) {
        lifecycleAd($this->owner, ['created_at' => now()->subMonths(2)]);
    }
    $draft = lifecycleAd($this->owner, ['status' => 'draft', 'is_published' => false, 'is_approved' => false]);
    expect(fn () => app(AdService::class)->submit($draft))->toThrow(ValidationException::class);
    $first = Ad::first();
    app(AdService::class)->update($first, ['is_published' => false]);
    app(AdService::class)->submit($draft);
    app(AdService::class)->approve($draft);
    expect($draft->fresh()->isPubliclyVisible())->toBeTrue()
        ->and(app(SubscriptionEntitlements::class)->published($this->owner->id)->count())->toBe(3);
});

test('owners cannot publish another owners property', function () {
    $ad = lifecycleAd($this->owner, ['is_published' => false]);
    $this->actingAs(User::factory()->create())->put(route('dashboard.properties.update', $ad), ['is_published' => true])->assertForbidden();
});

test('seven day reminder is durable unique and catches delayed runs but never sends too early', function () {
    $this->sub->update(['expires_at' => now()->addDays(8)]);
    $this->artisan('subscriptions:process-lifecycle')->assertSuccessful();
    expect(SubscriptionNotice::count())->toBe(0);
    $this->travel(1)->days();
    $this->artisan('subscriptions:process-lifecycle')->assertSuccessful();
    $this->lifecycle->process();
    sendLifecycleNotices();
    sendLifecycleNotices();
    expect(SubscriptionNotice::where('kind', 'expiring')->count())->toBe(1);
    Mail::assertSent(SubscriptionLifecycleMail::class, 1);
    $this->sub->update(['expires_at' => now()->addDays(5)]);
    $this->lifecycle->process();
    expect(SubscriptionNotice::where('kind', 'expiring')->count())->toBe(2);
});

test('exact expiry hides properties without deletion or overwriting administrative states', function () {
    $published = lifecycleAd($this->owner);
    $published->images()->create(['path' => 'keep.jpg', 'position' => 0]);
    $suspended = lifecycleAd($this->owner, ['status' => 'rejected', 'is_approved' => false, 'is_published' => false]);
    $manual = lifecycleAd($this->owner, ['is_published' => false]);
    $manual->forceFill(['hidden_reason' => 'manual'])->save();
    $this->sub->update(['expires_at' => now()]);
    // Public checks fail closed before the scheduler catches up.
    $this->get(route('property.show', $published))->assertNotFound();
    $this->lifecycle->process();
    $this->lifecycle->process();
    sendLifecycleNotices();
    sendLifecycleNotices();
    expect($this->sub->fresh()->status)->toBe('expired')
        ->and($published->fresh()->hidden_reason)->toBe('subscription_expired')
        ->and($published->fresh()->status)->toBe('published')
        ->and($published->images()->count())->toBe(1)
        ->and(Ad::count())->toBe(3)
        ->and($suspended->fresh()->status)->toBe('rejected')
        ->and($manual->fresh()->hidden_reason)->toBe('manual');
    $this->actingAs($this->owner)->get(route('dashboard.properties.show', $published))->assertOk();
    expect(SubscriptionNotice::where('kind', 'expired')->count())->toBe(1);
    Mail::assertSent(SubscriptionLifecycleMail::class, 1);
});

test('weekly reminders catch up once per current period and stop immediately on renewal', function () {
    lifecycleAd($this->owner);
    $this->sub->update(['expires_at' => now()]);
    $this->lifecycle->process();
    sendLifecycleNotices();
    $this->travel(6)->days();
    $this->lifecycle->process();
    expect(SubscriptionNotice::where('kind', 'weekly')->count())->toBe(0);
    $this->travel(1)->days();
    $this->lifecycle->process();
    $this->lifecycle->process();
    sendLifecycleNotices();
    sendLifecycleNotices();
    expect(SubscriptionNotice::where('kind', 'weekly')->count())->toBe(1);
    $this->travel(22)->days();
    $this->lifecycle->process();
    expect(SubscriptionNotice::where('kind', 'weekly')->count())->toBe(2);
    $renewal = lifecycleRenew($this->sub);
    sendLifecycleNotices();
    expect(SubscriptionNotice::where('kind', 'weekly')->whereNotNull('sent_at')->count())->toBe(1)
        ->and($renewal->isActive())->toBeTrue();
    $this->lifecycle->process();
    expect(SubscriptionNotice::where('kind', 'weekly')->count())->toBe(2);
});

test('renewal restores only eligible newest properties within the new limit', function () {
    $oldest = lifecycleAd($this->owner);
    $this->travel(1)->seconds();
    $middle = lifecycleAd($this->owner);
    $this->travel(1)->seconds();
    $newest = lifecycleAd($this->owner);
    $manual = lifecycleAd($this->owner, ['is_published' => false]);
    $manual->forceFill(['hidden_reason' => 'manual'])->save();
    $archived = lifecycleAd($this->owner, ['status' => 'archived', 'is_published' => false]);
    $this->sub->update(['expires_at' => now()]);
    $this->lifecycle->process();
    $new = lifecycleRenew($this->sub, '2');
    expect($newest->fresh()->is_published)->toBe(1)->and($middle->fresh()->is_published)->toBe(1)
        ->and($oldest->fresh()->hidden_reason)->toBe('subscription_expired')
        ->and($manual->fresh()->hidden_reason)->toBe('manual')->and($archived->fresh()->status)->toBe('archived')
        ->and(SubscriptionNotice::where('subscription_id', $new->id)->where('kind', 'activated')->first()->context)->toBe(['restored' => 2, 'hidden' => 1]);
});

test('early renewal preserves remaining days and replay after replacement cannot activate twice', function () {
    $expiry = $this->sub->expires_at->copy();
    $new = lifecycleRenew($this->sub);
    expect($new->expires_at->equalTo($expiry->addMonthNoOverflow()))->toBeTrue()
        ->and(Subscription::where('user_id', $this->owner->id)->where('status', 'active')->count())->toBe(1);
    expect(app(ActivateSubscription::class)->execute($new->id, ['paymentId' => $new->payment_id]))->toBeFalse();
    expect(app(ActivateSubscription::class)->execute($this->sub->id, ['paymentId' => $this->sub->payment_id]))->toBeFalse();
    expect(SubscriptionNotice::where('kind', 'activated')->count())->toBe(1);
});

test('downgrade hides only excess newest-first and explicit unlimited is supported', function () {
    $old = lifecycleAd($this->owner);
    $this->travel(1)->seconds();
    $new = lifecycleAd($this->owner);
    $this->travel(1)->seconds();
    $latest = lifecycleAd($this->owner);
    $replacement = lifecycleRenew($this->sub, '1');
    expect($latest->fresh()->is_published)->toBe(1)->and($old->fresh()->hidden_reason)->toBe('plan_limit')
        ->and($new->fresh()->hidden_reason)->toBe('plan_limit');
    lifecycleRenew($replacement, 'Unlimited');
    expect(app(SubscriptionEntitlements::class)->published($this->owner->id)->count())->toBe(3);
});

test('renewal catches up property masking even when the scheduler was offline for weeks', function () {
    lifecycleAd($this->owner);
    lifecycleAd($this->owner);
    $this->sub->update(['expires_at' => now()->subWeeks(3)]);
    lifecycleRenew($this->sub, '1');
    expect(Ad::where('is_published', true)->count())->toBe(1)
        ->and(Ad::where('hidden_reason', 'subscription_expired')->count())->toBe(1);
});

test('queue delivery retries after temporary failure without consuming the notice', function () {
    $notice = $this->lifecycle->recordNotice($this->sub, 'expiring', $this->sub->expires_at->toIso8601String());
    $mailFake = Mail::getFacadeRoot();
    Mail::swap(Mockery::mock(Mailer::class, function ($mock) {
        $mock->shouldReceive('to')->once()->andThrow(new RuntimeException('Temporary outage'));
    }));
    expect(fn () => (new SendSubscriptionNotice($notice->id))->handle(app(SubscriptionEntitlements::class)))->toThrow(RuntimeException::class);
    expect($notice->fresh()->sent_at)->toBeNull()->and($notice->fresh()->attempts)->toBe(1);
    Mail::swap($mailFake);
    sendLifecycleNotices();
    sendLifecycleNotices();
    Mail::assertSent(SubscriptionLifecycleMail::class, 1);
});

test('account deletion preferences and absence of hidden properties suppress weekly reminders', function ($condition) {
    $ad = lifecycleAd($this->owner);
    $this->sub->update(['expires_at' => now()->subWeeks(2)]);
    $this->lifecycle->process();
    if ($condition === 'deleted') {
        $this->owner->forceFill(['anonymized_at' => now()])->save();
    }
    if ($condition === 'preferences') {
        $this->owner->update(['notifications_enabled' => false]);
    }
    if ($condition === 'manual') {
        app(AdService::class)->update($ad, ['is_published' => false]);
    }
    sendLifecycleNotices();
    expect(SubscriptionNotice::where('kind', 'weekly')->whereNotNull('sent_at')->count())->toBe(0);
})->with(['deleted', 'preferences', 'manual']);

test('cancel at term preserves rights while immediate cancellation records its own reason', function () {
    $ad = lifecycleAd($this->owner);
    $this->lifecycle->cancel($this->sub, false, 'Stop future renewal');
    expect($this->sub->fresh()->isActive())->toBeTrue()->and($ad->fresh()->isPubliclyVisible())->toBeTrue();
    $this->lifecycle->cancel($this->sub, true, 'Immediate cancellation requested');
    expect($this->sub->fresh()->isActive())->toBeFalse()->and($ad->fresh()->hidden_reason)->toBe('subscription_cancelled');
});

test('expiry follows the configured timezone at the exact boundary', function () {
    config(['app.timezone' => 'Africa/Kinshasa']);
    $this->travelTo(Carbon::parse('2026-10-10 09:00:00', 'Africa/Kinshasa'));
    $this->sub->update(['started_at' => now()->subDay(), 'expires_at' => now()->addSecond()]);
    expect($this->sub->fresh()->isActive())->toBeTrue();
    $this->travel(1)->seconds();
    $this->lifecycle->process();
    expect($this->sub->fresh()->status)->toBe('expired');
});

test('manual approval uses the same paid lifecycle and remains idempotent', function () {
    $this->seed(RolePermissionSeeder::class);
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $sub = app(SubscriptionRepository::class)->createPending($this->owner->id, $this->sub->plan);
    $this->actingAs($admin)->put(route('dashboard.payment-requests.approve', $sub))->assertSessionHas('success');
    $expiry = $sub->fresh()->expires_at;
    $this->put(route('dashboard.payment-requests.approve', $sub))->assertSessionHas('success');
    expect($sub->fresh()->approved_by)->toBe($admin->id)
        ->and($sub->fresh()->isActive())->toBeTrue()
        ->and($sub->fresh()->expires_at->equalTo($expiry))->toBeTrue()
        ->and(SubscriptionNotice::where('subscription_id', $sub->id)->count())->toBe(1);
});

test('administrative changes require permission and a reason and record old and new dates', function () {
    $this->seed(RolePermissionSeeder::class);
    $payload = ['action' => 'extend', 'expires_at' => now()->addMonths(3)->toIso8601String(), 'reason' => 'Correction commerciale'];
    $this->actingAs($this->owner)->patch(route('dashboard.subscriptions.update', $this->sub), $payload)->assertForbidden();
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $this->actingAs($admin)->patch(route('dashboard.subscriptions.update', $this->sub), array_merge($payload, ['reason' => '']))->assertSessionHasErrors('reason');
    $this->patch(route('dashboard.subscriptions.update', $this->sub), $payload)->assertSessionHas('success');
    $audit = AuditLog::where('action', 'subscription.extended')->sole();
    expect($audit->user_id)->toBe($admin->id)->and($audit->old_values)->toHaveKey('expires_at')->and($audit->new_values)->toHaveKey('expires_at');
});

test('malformed limits fail closed and purchased limits survive later plan edits', function () {
    $this->sub->update(['plan_features' => []]);
    $ad = lifecycleAd($this->owner, ['status' => 'draft', 'is_published' => false, 'is_approved' => false]);
    expect(fn () => app(AdService::class)->submit($ad))->toThrow(ValidationException::class);
    $this->sub->update(['plan_features' => [['name' => 'listing_limit', 'value' => '2']]]);
    $this->sub->plan->features()->where('name', 'Listings per month')->update(['value' => 1]);
    expect($this->sub->fresh()->limits()->listingLimit)->toBe(2);
});

test('scheduler repairs legacy duplicate active rows without losing the longest entitlement', function () {
    $longer = grantTestPublicationRights($this->owner);
    $longer->update(['expires_at' => now()->addMonths(3)]);
    $this->lifecycle->process();
    expect(Subscription::where('status', 'active')->count())->toBe(1)
        ->and($longer->fresh()->isActive())->toBeTrue()
        ->and(Subscription::count())->toBe(2);
});

test('the sitemap cache expires with the subscription even without a scheduler run', function () {
    $ad = lifecycleAd($this->owner);
    $this->sub->update(['expires_at' => now()->addSeconds(5)]);
    $this->get(route('sitemap'))->assertSee(route('property.show', $ad), false);
    $this->travel(5)->seconds();
    $this->get(route('sitemap'))->assertDontSee(route('property.show', $ad), false);
});

test('a confirmed refund immediately hides properties without deleting them', function () {
    $ad = lifecycleAd($this->owner);
    app(StatusUpdater::class)->refundCompleted(['data' => ['paymentId' => $this->sub->payment_id]]);
    expect($this->sub->fresh()->status)->toBe('refunded')
        ->and($ad->fresh()->is_published)->toBe(0)
        ->and($ad->fresh()->isPubliclyVisible())->toBeFalse();
});

test('queued weekly notices are skipped when no hidden properties remain', function () {
    $this->sub->update(['expires_at' => now()->subWeeks(2)]);
    $this->lifecycle->process();
    expect(SubscriptionNotice::where('kind', 'weekly')->count())->toBe(0);
});

test('renewal never restores a listing suspended after expiration or a listing now incomplete', function () {
    $suspended = lifecycleAd($this->owner);
    $incomplete = lifecycleAd($this->owner);
    $this->sub->update(['expires_at' => now()]);
    $this->lifecycle->process();
    app(AdService::class)->suspend($suspended);
    $incomplete->details()->update(['details' => []]);
    lifecycleRenew($this->sub);
    expect($suspended->fresh()->hidden_reason)->toBe('admin_suspended')
        ->and($suspended->fresh()->is_published)->toBe(0)
        ->and($incomplete->fresh()->is_published)->toBe(0);
});

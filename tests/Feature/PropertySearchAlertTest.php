<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use App\Jobs\SendPropertySearchAlerts;
use App\Mail\NewPropertySearchAlertMail;
use App\Models\PropertySearchAlert;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

beforeEach(function () {
    Mail::fake();
    $country = Country::create(['name' => 'Congo', 'iso_code' => 'CD']);
    $city = City::create(['name' => 'Kinshasa', 'country_id' => $country->id]);
    $this->zone = Municipality::create(['name' => 'Gombe', 'city_id' => $city->id]);
    $this->otherZone = Municipality::create(['name' => 'Ngaliema', 'city_id' => $city->id]);
    $this->user = User::factory()->create(['language' => 'fr']);
});

function searchAlertProperty(int $zoneId, bool $published = true): Ad
{
    $owner = User::factory()->create();
    grantTestPublicationRights($owner);

    return Ad::create([
        'user_id' => $owner->id,
        'category_id' => Category::create(['name' => 'Maison '.fake()->uuid(), 'slug' => fake()->uuid(), 'is_active' => true])->id,
        'municipality_id' => $zoneId,
        'ad_type' => 'sale', 'reference' => fake()->uuid(), 'title' => 'Maison lumineuse',
        'price' => 100000, 'currency' => 'USD', 'status' => $published ? 'published' : 'draft',
        'is_published' => $published, 'is_approved' => $published,
    ]);
}

function enableSearchAlert($test): PropertySearchAlert
{
    $test->actingAs($test->user)->postJson(route('search-alerts.store'), [
        'municipality_id' => $test->zone->id,
        'email' => 'someone-else@example.com',
    ])->assertOk();

    return PropertySearchAlert::sole();
}

test('only verified users can opt in and repeated consent does not reset the subscription', function () {
    $this->postJson(route('search-alerts.store'), ['municipality_id' => $this->zone->id])->assertUnauthorized();
    $this->actingAs(User::factory()->unverified()->create())
        ->postJson(route('search-alerts.store'), ['municipality_id' => $this->zone->id])->assertForbidden();
    $alert = enableSearchAlert($this);
    $subscribedAt = $alert->subscribed_at;
    $this->travel(2)->minutes();
    enableSearchAlert($this);
    expect($alert->fresh()->subscribed_at)->toBe($subscribedAt)
        ->and($alert->user_id)->toBe($this->user->id);
    $this->postJson(route('search-alerts.store'), ['municipality_id' => 99999])->assertUnprocessable();
});

test('only newly published properties in the subscribed area are emailed once', function () {
    searchAlertProperty($this->zone->id);
    $this->travel(1)->seconds();
    $alert = enableSearchAlert($this);
    $this->travel(1)->seconds();
    $draft = searchAlertProperty($this->zone->id, false);
    searchAlertProperty($this->otherZone->id);
    $new = searchAlertProperty($this->zone->id);
    $job = new SendPropertySearchAlerts($alert->id);
    $job->handle();
    $job->handle();
    Mail::assertSent(NewPropertySearchAlertMail::class, 1);
    Mail::assertSent(NewPropertySearchAlertMail::class, fn ($mail) => $mail->ad->id === $new->id && $mail->hasTo($this->user->email));

    $draft->update(['is_published' => true]);
    $job->handle();
    Mail::assertSent(NewPropertySearchAlertMail::class, 1);
    $draft->update(['is_approved' => true, 'status' => 'published']);
    $job->handle();
    Mail::assertSent(NewPropertySearchAlertMail::class, 2);
    $firstPublishedAt = $new->first_published_at;
    $new->update(['title' => 'Updated title', 'is_published' => false]);
    $new->update(['is_published' => true]);
    $job->handle();
    expect($new->first_published_at)->toBe($firstPublishedAt);
    Mail::assertSent(NewPropertySearchAlertMail::class, 2);
});

test('signed unsubscribe requires explicit confirmation and stops pending emails', function () {
    $alert = enableSearchAlert($this);
    $url = URL::signedRoute('search-alerts.unsubscribe', ['alert' => $alert->id]);
    $this->get(route('search-alerts.unsubscribe', $alert))->assertForbidden();
    $this->get($url)->assertOk()->assertSee('Gombe');
    expect($alert->fresh()->active)->toBeTrue();
    $this->post($url)->assertOk();
    $this->travel(1)->seconds();
    searchAlertProperty($this->zone->id);
    (new SendPropertySearchAlerts($alert->id))->handle();
    Mail::assertNothingSent();
    $this->travel(1)->seconds();
    enableSearchAlert($this);
    (new SendPropertySearchAlerts($alert->id))->handle();
    Mail::assertNothingSent();
});

test('withdrawn properties and users whose email is no longer verified receive no alert', function () {
    $alert = enableSearchAlert($this);
    $this->travel(1)->seconds();
    $ad = searchAlertProperty($this->zone->id);
    $ad->update(['is_published' => false]);
    (new SendPropertySearchAlerts($alert->id))->handle();
    $ad->update(['is_published' => true]);
    $this->user->forceFill(['email_verified_at' => null])->save();
    (new SendPropertySearchAlerts($alert->id))->handle();
    Mail::assertNothingSent();
});

test('the alert email includes the property and a valid unsubscribe link', function () {
    $alert = enableSearchAlert($this);
    $ad = searchAlertProperty($this->zone->id);
    $mail = new NewPropertySearchAlertMail($ad, $alert);
    $mail->assertSeeInHtml('Gombe');
    $mail->assertSeeInHtml('Maison lumineuse');
    $mail->assertSeeInHtml(route('property.show', $ad));
    $this->get($mail->content()->with['unsubscribeUrl'])->assertOk();
});

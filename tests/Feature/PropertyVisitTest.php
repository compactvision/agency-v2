<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Mail\PropertyVisitConfirmationMail;
use App\Mail\PropertyVisitRequestedMail;
use App\Models\PropertyVisit;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

function createVisitableProperty(User $owner, bool $published = true): Ad
{
    $category = Category::create([
        'name' => 'Visit category '.fake()->uuid(),
        'slug' => fake()->uuid(),
        'is_active' => true,
    ]);

    return Ad::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'VISIT-'.fake()->unique()->numerify('########'),
        'title' => 'Villa available for viewing',
        'price' => 180000,
        'currency' => 'USD',
        'status' => $published ? 'published' : 'draft',
        'is_published' => $published,
        'is_approved' => $published,
    ]);
}

test('an authenticated user can schedule a property visit', function () {
    Mail::fake();
    $owner = User::factory()->create(['language' => 'fr']);
    $visitor = User::factory()->create(['language' => 'en']);
    $property = createVisitableProperty($owner);
    $scheduledAt = now()->addDays(3)->setTime(14, 30);

    $this->actingAs($visitor)
        ->post(route('property.visit.schedule', $property), [
            'phone' => '+243 999 123 456',
            'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
            'message' => 'I am available in the afternoon.',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $visit = PropertyVisit::sole();

    expect($visit->ad_id)->toBe($property->id)
        ->and($visit->owner_id)->toBe($owner->id)
        ->and($visit->visitor_id)->toBe($visitor->id)
        ->and($visit->status)->toBe('pending')
        ->and($visit->scheduled_at->format('Y-m-d H:i'))->toBe($scheduledAt->format('Y-m-d H:i'));

    Mail::assertSent(PropertyVisitRequestedMail::class, fn ($mail) => $mail->hasTo($owner->email));
    Mail::assertSent(PropertyVisitConfirmationMail::class, fn ($mail) => $mail->hasTo($visitor->email));
});

test('a visit requires a future date and a phone number', function () {
    $owner = User::factory()->create();
    $visitor = User::factory()->create();
    $property = createVisitableProperty($owner);

    $this->actingAs($visitor)
        ->post(route('property.visit.schedule', $property), [
            'scheduled_at' => now()->subHour()->format('Y-m-d H:i:s'),
        ])
        ->assertSessionHasErrors(['phone', 'scheduled_at']);

    expect(PropertyVisit::count())->toBe(0);
});

test('owners cannot schedule a visit for their own property', function () {
    $owner = User::factory()->create();
    $property = createVisitableProperty($owner);

    $this->actingAs($owner)
        ->post(route('property.visit.schedule', $property), [
            'phone' => '+243 999 123 456',
            'scheduled_at' => now()->addDay()->format('Y-m-d H:i:s'),
        ])
        ->assertUnprocessable();

    expect(PropertyVisit::count())->toBe(0);
});

test('a visit cannot be scheduled for an unpublished property', function () {
    $owner = User::factory()->create();
    $visitor = User::factory()->create();
    $property = createVisitableProperty($owner, false);

    $this->actingAs($visitor)
        ->post(route('property.visit.schedule', $property), [
            'phone' => '+243 999 123 456',
            'scheduled_at' => now()->addDay()->format('Y-m-d H:i:s'),
        ])
        ->assertNotFound();

    expect(PropertyVisit::count())->toBe(0);
});

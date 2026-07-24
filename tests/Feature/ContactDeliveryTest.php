<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Categories\Models\Category;
use App\Mail\ContactMessage;
use App\Mail\PropertyOwnerContactMessage;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('validates and delivers a public contact message', function () {
    Mail::fake();
    config()->set('mail.from.address', 'support@agency.test');

    $response = $this->post(route('contact.send'), [
        'name' => 'Marie Test',
        'email' => 'marie@example.com',
        'phone' => '+243 999 000 000',
        'subject' => 'Recherche appartement',
        'message' => 'Je recherche un appartement disponible à Kinshasa.',
    ]);

    $response->assertRedirect()->assertSessionHas('success');
    Mail::assertSent(ContactMessage::class, function (ContactMessage $mail) {
        return $mail->hasTo('support@agency.test')
            && $mail->contact['email'] === 'marie@example.com';
    });
});

it('does not send an invalid public contact message', function () {
    Mail::fake();

    $this->from(route('contact'))
        ->post(route('contact.send'), [
            'name' => '',
            'email' => 'invalid',
            'subject' => '',
            'message' => 'court',
        ])
        ->assertRedirect(route('contact'))
        ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);

    Mail::assertNothingSent();
});

it('delivers a property enquiry only for a public property', function () {
    Mail::fake();

    $owner = User::factory()->create([
        'email' => 'owner@example.com',
        'email_verified_at' => now(),
    ]);
    $sender = User::factory()->create(['email_verified_at' => now()]);
    $category = Category::create([
        'name' => 'Appartement test',
        'slug' => 'appartement-test',
        'is_active' => true,
    ]);
    $ad = Ad::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'ad_type' => 'rent',
        'reference' => 'UX-TEST-001',
        'title' => 'Appartement accessible',
        'description' => 'Description',
        'price' => 1200,
        'currency' => 'USD',
        'status' => 'published',
        'is_published' => true,
        'is_approved' => true,
    ]);

    $this->actingAs($sender)
        ->post(route('contact.owner', $ad->slug), [
            'phone' => '+243 999 000 000',
            'message' => 'Bonjour, je souhaite organiser une visite cette semaine.',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    Mail::assertSent(
        PropertyOwnerContactMessage::class,
        fn (PropertyOwnerContactMessage $mail) => $mail->hasTo(
            'owner@example.com',
        ) && $mail->ad->is($ad),
    );
});

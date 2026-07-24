<?php

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Infrastructure\Mail\ManualSubscriptionAdminMail;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionActivatedMail;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionExpiredMail;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionExpiringMail;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Categories\Models\Category;
use App\Mail\AdminNewPropertyNotification;
use App\Mail\ContactMessage;
use App\Mail\PropertyApprovedMail;
use App\Mail\PropertyOwnerContactMessage;
use App\Mail\PropertyRejectedMail;
use App\Mail\PropertyValidationPending;
use App\Mail\WelcomeSeller;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\App;

function mailTranslationKeys(array $translations, string $prefix = ''): array
{
    $keys = [];

    foreach ($translations as $key => $value) {
        $path = $prefix === '' ? $key : "{$prefix}.{$key}";
        $keys = [
            ...$keys,
            ...(is_array($value)
                ? mailTranslationKeys($value, $path)
                : [$path]),
        ];
    }

    return $keys;
}

function createMailProperty(User $owner): Ad
{
    $category = Category::create([
        'name' => 'Email property',
        'slug' => 'email-property',
        'is_active' => true,
    ]);

    return Ad::create([
        'user_id' => $owner->id,
        'category_id' => $category->id,
        'ad_type' => 'sale',
        'reference' => 'MAIL-001',
        'title' => 'Modern city residence',
        'description' => 'A professionally presented property.',
        'price' => 250000,
        'currency' => 'USD',
        'status' => 'published',
        'is_published' => true,
        'is_approved' => true,
    ])->load('user');
}

function createMailSubscription(User $user): Subscription
{
    $plan = Plan::create([
        'name' => 'Signature',
        'price' => 75,
        'interval' => 'monthly',
        'is_active' => true,
        'position' => 1,
    ]);

    return Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'plan_name' => $plan->name,
        'transaction_id' => 'MAIL-SUB-001',
        'status' => 'active',
        'amount' => 75,
        'currency' => 'USD',
        'started_at' => now(),
        'expires_at' => now()->addMonth(),
    ])->load(['user', 'plan']);
}

test('French and English business email catalogs stay in sync', function () {
    $french = require lang_path('fr/mail.php');
    $english = require lang_path('en/mail.php');

    expect(mailTranslationKeys($french))
        ->toEqualCanonicalizing(mailTranslationKeys($english));
});

test('all business emails render with the brand and valid current links', function () {
    config()->set('app.url', 'https://agency.example.test');

    $owner = User::factory()->create([
        'name' => 'English Owner',
        'language' => 'en',
    ]);
    $sender = User::factory()->create([
        'name' => 'Interested Buyer',
        'language' => 'fr',
    ]);
    $property = createMailProperty($owner);
    $subscription = createMailSubscription($owner);
    $contact = [
        'name' => 'Website Visitor',
        'email' => 'visitor@example.test',
        'phone' => '+243 999 000 000',
        'subject' => 'Property advisory',
        'message' => '<script>alert("unsafe")</script> Please contact me.',
    ];

    $mailables = [
        new ContactMessage($contact),
        new PropertyOwnerContactMessage($property, $sender, $contact),
        new WelcomeSeller($owner, 'agency'),
        new PropertyValidationPending($property),
        new AdminNewPropertyNotification($property),
        new PropertyApprovedMail($property),
        new PropertyRejectedMail($property, 'Please add a clearer ownership document.'),
        new ManualSubscriptionAdminMail($owner->id, 'Signature', $subscription->id),
        new SubscriptionActivatedMail($subscription),
        new SubscriptionExpiredMail($subscription),
        new SubscriptionExpiringMail($subscription, 3),
    ];

    foreach ($mailables as $mailable) {
        $html = $mailable->render();

        expect($html)
            ->toContain('/brand/the-agency-logo-light.png')
            ->not->toContain('/dashboard/admin/')
            ->not->toContain('/dashboard/billing')
            ->not->toContain('<script>alert');
    }

    expect((new PropertyApprovedMail($property))->render())
        ->toContain('Your listing is live')
        ->toContain(route('property.show', $property))
        ->and((new PropertyValidationPending($property))->render())
        ->toContain(route('dashboard.properties.index'))
        ->and((new ManualSubscriptionAdminMail(
            $owner->id,
            'Signature',
            $subscription->id,
        ))->render())
        ->toContain(route('dashboard.payment-requests.index'));
});

test('authentication emails use professional localized messages', function () {
    $user = User::factory()->create([
        'name' => 'English Client',
        'language' => 'en',
    ]);

    App::setLocale($user->preferredLocale());

    try {
        $verification = (new VerifyEmail)->toMail($user);
        $passwordReset = (new ResetPassword('secure-reset-token'))->toMail($user);

        expect($verification->subject)
            ->toBe('Confirm your email address — The Agency')
            ->and($verification->actionText)
            ->toBe('Confirm my email address')
            ->and($passwordReset->subject)
            ->toBe('Reset your password — The Agency')
            ->and($passwordReset->actionText)
            ->toBe('Reset my password')
            ->and($passwordReset->actionUrl)
            ->toContain('secure-reset-token');
    } finally {
        App::setLocale(config('app.locale'));
    }
});

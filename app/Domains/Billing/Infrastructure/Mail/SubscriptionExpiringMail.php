<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use App\Domains\Billing\Models\Subscription;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionExpiringMail extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(
        public readonly Subscription $subscription,
        public readonly int $daysRemaining,
    ) {
        $this->useMailLocale($subscription->user?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: trans_choice('mail.subjects.subscription_expiring', $this->daysRemaining, [
                'count' => $this->daysRemaining,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.billing.subscription-expiring',
            with: [
                'planName' => $this->subscription->plan_name
                    ?: $this->subscription->plan?->name
                    ?: __('mail.common.not_available'),
                'subscriptionsUrl' => route('dashboard.subscriptions.index'),
            ],
        );
    }
}

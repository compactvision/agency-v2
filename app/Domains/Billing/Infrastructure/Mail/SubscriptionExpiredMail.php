<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use App\Domains\Billing\Models\Subscription;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionExpiredMail extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(
        public readonly Subscription $subscription,
    ) {
        $this->useMailLocale($subscription->user?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.subscription_expired', [
                'plan' => $this->planName(),
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.billing.subscription-expired',
            with: [
                'planName' => $this->planName(),
                'subscriptionsUrl' => route('dashboard.subscriptions.index'),
            ],
        );
    }

    private function planName(): string
    {
        return $this->subscription->plan_name
            ?: $this->subscription->plan?->name
            ?: __('mail.common.not_available');
    }
}

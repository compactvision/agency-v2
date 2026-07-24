<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ManualSubscriptionAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly string $planName,
        public readonly int $subscriptionId,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.manual_subscription', [
                'plan' => $this->planName,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.billing.manual-subscription-request',
            with: [
                'paymentRequestsUrl' => route(
                    'dashboard.payment-requests.index',
                    ['search' => $this->subscriptionId],
                ),
            ],
        );
    }
}

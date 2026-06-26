<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use App\Domains\Billing\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionExpiredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Subscription $subscription,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "❌ Votre abonnement {$this->subscription->plan->name} a expiré",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.billing.subscription-expired',
        );
    }
}

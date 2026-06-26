<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use App\Domains\Billing\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionExpiringMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Subscription $subscription,
        public readonly int          $daysRemaining,
    ) {}

    public function envelope(): Envelope
    {
        $label = $this->daysRemaining === 0
            ? "expire aujourd'hui"
            : "expire dans {$this->daysRemaining} jour(s)";

        return new Envelope(
            subject: "⚠️ Votre abonnement {$label}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.billing.subscription-expiring',
        );
    }
}

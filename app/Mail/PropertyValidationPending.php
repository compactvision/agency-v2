<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyValidationPending extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public \App\Domains\Ads\Models\Ad $ad
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre propriété est en cours de validation',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.ads.validation-pending',
            with: [
                'propertyTitle' => $this->ad->title,
                'reference' => $this->ad->reference,
                'userName' => $this->ad->user->name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

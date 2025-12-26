<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNewPropertyNotification extends Mailable
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
            subject: 'Nouvelle propriété à valider - ' . $this->ad->reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.ads.admin-new-property',
            with: [
                'propertyTitle' => $this->ad->title,
                'reference' => $this->ad->reference,
                'userName' => $this->ad->user->name,
                'userEmail' => $this->ad->user->email,
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

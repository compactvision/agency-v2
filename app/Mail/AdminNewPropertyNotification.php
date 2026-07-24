<?php

namespace App\Mail;

use App\Domains\Ads\Models\Ad;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
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
        public Ad $ad
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.admin_property_pending', [
                'reference' => $this->ad->reference,
            ]),
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
                'validationUrl' => route(
                    'dashboard.properties.validation.show',
                    $this->ad->id,
                ),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

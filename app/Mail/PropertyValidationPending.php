<?php

namespace App\Mail;

use App\Domains\Ads\Models\Ad;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyValidationPending extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Ad $ad
    ) {
        $this->useMailLocale($ad->user?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.property_pending', [
                'reference' => $this->ad->reference,
            ]),
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
                'propertiesUrl' => route('dashboard.properties.index'),
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

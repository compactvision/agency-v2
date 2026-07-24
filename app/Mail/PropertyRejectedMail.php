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

class PropertyRejectedMail extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    /**
     * Create a new message instance.
     */
    public function __construct(public Ad $ad, public string $reason)
    {
        $this->useMailLocale($ad->user?->language);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.property_rejected', [
                'reference' => $this->ad->reference,
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.properties.rejected',
            with: [
                'editUrl' => route('dashboard.properties.edit', $this->ad->id),
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

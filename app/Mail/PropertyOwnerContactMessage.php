<?php

namespace App\Mail;

use App\Domains\Ads\Models\Ad;
use App\Models\User;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyOwnerContactMessage extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(
        public readonly Ad $ad,
        public readonly User $sender,
        public readonly array $contact,
    ) {
        $this->useMailLocale($ad->user?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->sender->email, $this->sender->name)],
            subject: __('mail.subjects.property_enquiry', [
                'reference' => $this->ad->reference,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.property-owner-contact',
            with: [
                'propertyUrl' => route('property.show', $this->ad),
            ],
        );
    }
}

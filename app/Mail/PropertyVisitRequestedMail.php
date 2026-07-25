<?php

namespace App\Mail;

use App\Models\PropertyVisit;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyVisitRequestedMail extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(public readonly PropertyVisit $visit)
    {
        $this->useMailLocale($visit->owner?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->visit->visitor_email, $this->visit->visitor_name)],
            subject: __('mail.subjects.property_visit_requested', [
                'reference' => $this->visit->property?->reference,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.properties.visit-requested',
            with: [
                'propertyUrl' => route('property.show', $this->visit->property),
            ],
        );
    }
}

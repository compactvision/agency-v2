<?php

namespace App\Mail;

use App\Models\PropertyVisit;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyVisitConfirmationMail extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(public readonly PropertyVisit $visit)
    {
        $this->useMailLocale($visit->visitor?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.property_visit_confirmation', [
                'reference' => $this->visit->property?->reference,
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.properties.visit-confirmation',
            with: [
                'propertyUrl' => route('property.show', $this->visit->property),
            ],
        );
    }
}

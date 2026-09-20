<?php

namespace App\Mail;

use App\Domains\Ads\Models\Ad;
use App\Models\PropertySearchAlert;
use App\Support\UsesMailLocale;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Facades\URL;

class NewPropertySearchAlertMail extends Mailable
{
    use UsesMailLocale;

    public function __construct(public Ad $ad, public PropertySearchAlert $alert)
    {
        $this->useMailLocale($alert->user->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('search-alerts.subject', ['zone' => $this->alert->municipality->name]));
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.properties.search-alert', with: [
            'propertyUrl' => route('property.show', $this->ad),
            'unsubscribeUrl' => URL::signedRoute('search-alerts.unsubscribe', ['alert' => $this->alert->id]),
        ]);
    }
}

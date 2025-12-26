<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeSeller extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $roleName
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Bienvenue chez Compact Agency - Votre compte est prêt !',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome_seller',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

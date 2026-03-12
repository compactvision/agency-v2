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
            subject: 'Bienvenue chez Agency DRC - Votre compte est prêt !',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome_seller',
            with: [
                'name' => $this->user->name,
                'role' => $this->roleName === 'agency' ? 'Agence Immobilière' : 'Vendeur Particulier',
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

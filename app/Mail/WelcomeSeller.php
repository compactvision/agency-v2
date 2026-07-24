<?php

namespace App\Mail;

use App\Models\User;
use App\Support\UsesMailLocale;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeSeller extends Mailable
{
    use Queueable, SerializesModels, UsesMailLocale;

    public function __construct(
        public User $user,
        public string $roleName
    ) {
        $this->useMailLocale($user->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.subjects.welcome_seller'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome_seller',
            with: [
                'name' => $this->user->name,
                'role' => __('mail.roles.'.$this->roleName),
                'dashboardUrl' => route('dashboard'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

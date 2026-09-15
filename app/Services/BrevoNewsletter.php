<?php

namespace App\Services;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class BrevoNewsletter
{
    public function sendWelcome(NewsletterSubscription $subscription, string $errorField = 'email'): void
    {
        $message = 'Votre inscription est enregistrée, mais l’email de bienvenue n’a pas pu être envoyé. Veuillez réessayer votre inscription plus tard.';

        // Serialize sends for this subscription, including simultaneous form submissions.
        DB::transaction(function () use ($subscription, $errorField, $message) {
            $subscription = NewsletterSubscription::whereKey($subscription->id)->lockForUpdate()->firstOrFail();
            if (! $subscription->is_active || $subscription->welcome_sent_at !== null) {
                return;
            }

            $senderEmail = config('services.brevo.sender_email');
            if (! filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
                Log::warning('Brevo newsletter sender is missing or invalid.');
                $this->fail($errorField, $message);
            }

            try {
                $response = $this->send('post', 'smtp/email', [
                    'sender' => [
                        'name' => config('services.brevo.sender_name'),
                        'email' => $senderEmail,
                    ],
                    'to' => [['email' => $subscription->email]],
                    'subject' => 'Bienvenue dans la newsletter de The Agency !',
                    'htmlContent' => view('emails.newsletter-welcome')->render(),
                    'textContent' => "Bienvenue dans la newsletter de The Agency !\n\nMerci pour votre inscription. Vous faites désormais partie de notre communauté.\n\nVous recevrez nos nouvelles annonces immobilières, nos conseils et les actualités de The Agency.\n\nÀ très bientôt,\nL’équipe The Agency",
                    'tags' => ['newsletter-welcome'],
                ], $errorField);
            } catch (ValidationException) {
                $this->fail($errorField, $message);
            }

            if (! is_string($response->json('messageId')) || $response->json('messageId') === '') {
                Log::warning('Brevo did not acknowledge the newsletter welcome email.');
                $this->fail($errorField, $message);
            }

            $subscription->update(['welcome_sent_at' => now()]);
        });
    }

    public function subscribe(string $email, string $errorField = 'email'): void
    {
        $this->send('post', 'contacts', [
            'email' => $email,
            'listIds' => [(int) config('services.brevo.newsletter_list_id')],
            'updateEnabled' => true,
        ], $errorField);
    }

    public function unsubscribe(string $email, string $errorField = 'newsletter'): void
    {
        $this->send('put', 'contacts/'.rawurlencode($email), [
            'unlinkListIds' => [(int) config('services.brevo.newsletter_list_id')],
        ], $errorField, true);
    }

    private function send(string $method, string $path, array $payload, string $errorField, bool $allowMissing = false): Response
    {
        $key = config('services.brevo.api_key');
        $listId = filter_var(config('services.brevo.newsletter_list_id'), FILTER_VALIDATE_INT);

        if (! is_string($key) || trim($key) === '' || ! $listId || $listId < 1) {
            Log::warning('Brevo newsletter configuration is missing or invalid.');
            $this->fail($errorField);
        }

        try {
            $response = Http::baseUrl('https://api.brevo.com/v3')
                ->withHeaders(['api-key' => $key])
                ->acceptJson()
                ->asJson()
                ->connectTimeout(5)
                ->timeout(15)
                ->{$method}($path, $payload);
        } catch (ConnectionException) {
            Log::warning('Brevo newsletter connection failed.');
            $this->fail($errorField);
        }

        if (! $response->successful() && ! ($allowMissing && $response->status() === 404)) {
            // Do not log contact addresses, API credentials or response bodies.
            Log::warning('Brevo newsletter request failed.', ['status' => $response->status(), 'operation' => $method === 'post' && $path === 'smtp/email' ? 'welcome_email' : 'contact']);
            $this->fail($errorField);
        }

        return $response;
    }

    private function fail(string $field, ?string $message = null): never
    {
        throw ValidationException::withMessages([
            $field => $message ?? 'La newsletter est momentanément indisponible. Veuillez réessayer plus tard.',
        ]);
    }
}

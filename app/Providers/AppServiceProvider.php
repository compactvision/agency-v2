<?php

namespace App\Providers;

use App\Domains\Ads\Models\Ad;
use App\Policies\AdPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::toMailUsing(
            fn ($notifiable, string $verificationUrl) => (new MailMessage)
                ->subject(__('mail.subjects.verify_email'))
                ->greeting(__('mail.auth.verify_greeting', [
                    'name' => $notifiable->name,
                ]))
                ->line(__('mail.auth.verify_intro'))
                ->action(__('mail.auth.verify_action'), $verificationUrl)
                ->line(__('mail.auth.verify_expiry', [
                    'count' => config('auth.verification.expire', 60),
                ]))
                ->line(__('mail.auth.verify_ignore')),
        );

        ResetPassword::toMailUsing(function ($notifiable, string $token) {
            $resetUrl = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject(__('mail.subjects.reset_password'))
                ->greeting(__('mail.auth.reset_greeting', [
                    'name' => $notifiable->name,
                ]))
                ->line(__('mail.auth.reset_intro'))
                ->action(__('mail.auth.reset_action'), $resetUrl)
                ->line(__('mail.auth.reset_expiry', [
                    'count' => config(
                        'auth.passwords.'.config('auth.defaults.passwords').'.expire',
                    ),
                ]))
                ->line(__('mail.auth.reset_ignore'));
        });

        Gate::before(function ($user): ?bool {
            return $user->hasRole('super-admin') ? true : null;
        });

        Gate::policy(Ad::class, AdPolicy::class);
    }
}

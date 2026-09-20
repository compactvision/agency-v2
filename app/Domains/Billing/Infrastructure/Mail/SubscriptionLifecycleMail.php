<?php

namespace App\Domains\Billing\Infrastructure\Mail;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Models\SubscriptionNotice;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use App\Support\UsesMailLocale;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SubscriptionLifecycleMail extends Mailable
{
    use UsesMailLocale;

    public function __construct(public SubscriptionNotice $notice)
    {
        $this->useMailLocale($notice->subscription->user?->language);
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: __('subscriptions.mail.'.$this->notice->kind));
    }

    public function content(): Content
    {
        $sub = $this->notice->subscription;

        return new Content(markdown: 'emails.billing.lifecycle', with: [
            'sub' => $sub,
            'days' => $sub->expires_at ? max(0, (int) ceil(now()->diffInDays($sub->expires_at, false))) : 0,
            'hidden' => Ad::where('user_id', $sub->user_id)->whereIn('hidden_reason', ['subscription_expired', 'plan_limit'])->count(),
            'published' => app(SubscriptionEntitlements::class)->published($sub->user_id)->count(),
            'renewUrl' => route('dashboard.subscriptions.index'),
        ]);
    }
}

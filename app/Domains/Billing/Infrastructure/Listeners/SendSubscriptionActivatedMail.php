<?php

namespace App\Domains\Billing\Infrastructure\Listeners;

use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionActivatedMail;
use App\Domains\Billing\Models\Subscription;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionActivatedMail implements ShouldQueue
{
    public function handle(SubscriptionActivated $event): void
    {
        $sub = Subscription::with(['user', 'plan'])
            ->where('user_id', $event->userId)
            ->where('plan_id', $event->planId)
            ->latest()
            ->first();

        if ($sub?->user?->email) {
            Mail::to($sub->user->email)->send(new SubscriptionActivatedMail($sub));
        }
    }
}

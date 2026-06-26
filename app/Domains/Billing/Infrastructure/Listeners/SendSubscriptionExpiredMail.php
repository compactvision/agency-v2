<?php

namespace App\Domains\Billing\Infrastructure\Listeners;

use App\Domains\Billing\Domain\Events\SubscriptionExpired;
use App\Domains\Billing\Infrastructure\Mail\SubscriptionExpiredMail;
use App\Domains\Billing\Models\Subscription;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionExpiredMail implements ShouldQueue
{
    public function handle(SubscriptionExpired $event): void
    {
        $sub = Subscription::with(['user', 'plan'])
            ->where('user_id', $event->userId)
            ->where('plan_id', $event->planId)
            ->latest()
            ->first();

        if ($sub?->user?->email) {
            Mail::to($sub->user->email)->send(new SubscriptionExpiredMail($sub));
        }
    }
}

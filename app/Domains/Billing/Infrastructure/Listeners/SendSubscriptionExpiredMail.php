<?php

namespace App\Domains\Billing\Infrastructure\Listeners;

use App\Domains\Billing\Domain\Events\SubscriptionExpired;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionNotice;
use App\Domains\Billing\Models\SubscriptionNotice;

class SendSubscriptionExpiredMail
{
    public function handle(SubscriptionExpired $event): void
    {
        if ($event->subscriptionId === null) {
            return;
        }
        SubscriptionNotice::where('subscription_id', $event->subscriptionId)
            ->where('kind', 'expired')->whereNull('sent_at')->each(fn ($notice) => SendSubscriptionNotice::dispatch($notice->id)->afterCommit());
    }
}

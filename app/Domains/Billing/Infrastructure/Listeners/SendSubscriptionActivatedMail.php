<?php

namespace App\Domains\Billing\Infrastructure\Listeners;

use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionNotice;
use App\Domains\Billing\Models\SubscriptionNotice;

class SendSubscriptionActivatedMail
{
    public function handle(SubscriptionActivated $event): void
    {
        if ($event->subscriptionId === null) {
            return;
        }
        SubscriptionNotice::where('subscription_id', $event->subscriptionId)->where('kind', 'activated')->whereNull('sent_at')->each(fn ($notice) => SendSubscriptionNotice::dispatch($notice->id)->afterCommit());
    }
}

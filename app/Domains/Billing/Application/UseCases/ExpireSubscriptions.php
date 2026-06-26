<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Domain\Events\SubscriptionExpired;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Models\Subscription;

/**
 * Expires all active subscriptions past their expiry date.
 * Called daily by the scheduler.
 */
class ExpireSubscriptions
{
    public function execute(): int
    {
        $count = 0;

        Subscription::query()
            ->where('status', SubscriptionStatus::Active->value)
            ->where('expires_at', '<', now())
            ->with('plan')
            ->each(function (Subscription $sub) use (&$count) {
                $sub->update(['status' => SubscriptionStatus::Expired->value]);

                event(new SubscriptionExpired(
                    userId: $sub->user_id,
                    planId: $sub->plan_id,
                ));

                $count++;
            });

        return $count;
    }
}

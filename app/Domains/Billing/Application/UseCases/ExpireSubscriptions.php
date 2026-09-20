<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\SubscriptionLifecycle;

class ExpireSubscriptions
{
    public function execute(): int
    {
        $count = 0;
        Subscription::where('status', 'active')->where('expires_at', '<=', now())->chunkById(100, function ($subs) use (&$count) {
            foreach ($subs as $sub) {
                $count += (int) app(SubscriptionLifecycle::class)->expire($sub);
            }
        });

        return $count;
    }
}

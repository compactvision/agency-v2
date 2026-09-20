<?php

namespace App\Console\Commands;

use App\Domains\Billing\Services\SubscriptionLifecycle;
use Illuminate\Console\Command;

class ProcessSubscriptionLifecycle extends Command
{
    protected $signature = 'subscriptions:process-lifecycle';

    protected $description = 'Expire subscriptions, preserve hidden properties and enqueue idempotent reminders';

    public function handle(SubscriptionLifecycle $lifecycle): int
    {
        $this->info($lifecycle->process().' abonnement(s) expiré(s). Notifications programmées.');

        return self::SUCCESS;
    }
}

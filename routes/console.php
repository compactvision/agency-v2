<?php

use App\Domains\Billing\Infrastructure\Jobs\ExpireSubscriptionsJob;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionExpiringReminder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Subscription Management ─────────────────────────────────────────────────

// Expire subscriptions whose expires_at has passed
Schedule::job(new ExpireSubscriptionsJob())->daily();

// Send renewal reminders: 7 days, 3 days and on the day of expiry
Schedule::job(new SendSubscriptionExpiringReminder(7))->dailyAt('08:00');
Schedule::job(new SendSubscriptionExpiringReminder(3))->dailyAt('08:00');
Schedule::job(new SendSubscriptionExpiringReminder(0))->dailyAt('08:00');


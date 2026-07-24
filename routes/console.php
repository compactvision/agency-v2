<?php

use App\Domains\Billing\Infrastructure\Jobs\ExpireSubscriptionsJob;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionExpiringReminder;
use App\Domains\Billing\Models\WebhookLog;
use App\Models\AuditLog;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Subscription Management ─────────────────────────────────────────────────

// Expire subscriptions whose expires_at has passed
Schedule::job(new ExpireSubscriptionsJob)
    ->dailyAt('00:10')
    ->name('subscriptions-expire')
    ->withoutOverlapping();

// Send renewal reminders: 7 days, 3 days and on the day of expiry
foreach ([7, 3, 0] as $daysBeforeExpiry) {
    Schedule::job(new SendSubscriptionExpiringReminder($daysBeforeExpiry))
        ->dailyAt('08:00')
        ->name("subscriptions-reminder-{$daysBeforeExpiry}")
        ->withoutOverlapping();
}

// Shared hosting: a single `schedule:run` cron also drains the database queue.
Schedule::command(
    'queue:work database --queue=default --stop-when-empty --max-time=50 --tries=3',
)
    ->everyMinute()
    ->name('queue-drain')
    ->withoutOverlapping();

// Limit database growth on shared hosting.
Schedule::call(fn () => WebhookLog::where('received_at', '<', now()->subDays(90))->delete())
    ->dailyAt('02:10')
    ->name('prune-webhook-logs')
    ->withoutOverlapping();
Schedule::call(fn () => AuditLog::where('created_at', '<', now()->subMonths(6))->delete())
    ->dailyAt('02:20')
    ->name('prune-audit-logs')
    ->withoutOverlapping();

Schedule::command('queue:prune-failed --hours=168')
    ->dailyAt('02:30')
    ->name('prune-failed-jobs')
    ->withoutOverlapping();

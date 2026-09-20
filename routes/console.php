<?php

use App\Domains\Billing\Models\WebhookLog;
use App\Jobs\SendPropertySearchAlerts;
use App\Models\AuditLog;
use App\Models\PropertySearchAlert;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Subscription Management ─────────────────────────────────────────────────

Schedule::command('subscriptions:process-lifecycle')
    ->everyMinute()->timezone(config('app.timezone'))
    ->name('subscriptions-lifecycle')->withoutOverlapping(10)->onOneServer();

// Shared hosting: a single `schedule:run` cron also drains the database queue.
Schedule::call(function () {
    PropertySearchAlert::where('active', true)->select('id')->chunkById(200, function ($alerts) {
        foreach ($alerts as $alert) {
            SendPropertySearchAlerts::dispatch($alert->id)->onConnection('database');
        }
    });
})->everyMinute()->name('property-search-alerts')->withoutOverlapping();

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

<?php

use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Models\SubscriptionNotice;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Process\Process;
use Tests\TestCase;

uses(TestCase::class);

test('two real processes cannot double activate the same payment or keep overlapping entitlements', function (bool $samePayment) {
    $path = tempnam(sys_get_temp_dir(), 'agency-subscriptions-');
    $original = config('database.default');
    try {
        config(['database.default' => 'lifecycle_test', 'database.connections.lifecycle_test' => [
            'driver' => 'sqlite', 'database' => $path, 'foreign_key_constraints' => true,
        ]]);
        Artisan::call('migrate', ['--database' => 'lifecycle_test', '--force' => true]);
        DB::statement('PRAGMA journal_mode = WAL');
        DB::statement('PRAGMA busy_timeout = 5000');
        $user = User::factory()->create();
        $plan = Plan::create(['name' => 'Concurrent plan', 'price' => 25, 'interval' => 'monthly', 'is_active' => true]);
        $plan->features()->create(['name' => 'Listings per month', 'value' => '3']);
        $first = app(SubscriptionRepository::class)->createPending($user->id, $plan);
        $second = $samePayment ? $first : app(SubscriptionRepository::class)->createPending($user->id, $plan);
        $start = (string) (microtime(true) + 1);
        $processes = [
            new Process([PHP_BINARY, base_path('tests/Support/subscription-activation-worker.php'), $path, (string) $first->id, 'race-payment-1', $start]),
            new Process([PHP_BINARY, base_path('tests/Support/subscription-activation-worker.php'), $path, (string) $second->id, $samePayment ? 'race-payment-1' : 'race-payment-2', $start]),
        ];
        foreach ($processes as $process) {
            $process->start();
        }
        foreach ($processes as $process) {
            $process->wait();
            expect($process->getErrorOutput())->toBe('');
            expect($process->isSuccessful())->toBeTrue();
        }
        expect(Subscription::where('status', 'active')->count())->toBe(1)
            ->and(SubscriptionNotice::where('kind', 'activated')->count())->toBe($samePayment ? 1 : 2);
        $notice = SubscriptionNotice::where('kind', 'activated')->latest('id')->first();
        $start = (string) (microtime(true) + 1);
        $senders = [
            new Process([PHP_BINARY, base_path('tests/Support/subscription-activation-worker.php'), $path, (string) $notice->id, '-', $start, 'notice']),
            new Process([PHP_BINARY, base_path('tests/Support/subscription-activation-worker.php'), $path, (string) $notice->id, '-', $start, 'notice']),
        ];
        foreach ($senders as $sender) {
            $sender->start();
        }
        foreach ($senders as $sender) {
            $sender->wait();
            expect($sender->getErrorOutput())->toBe('');
            expect($sender->isSuccessful())->toBeTrue();
        }
        expect(file_get_contents($path.'.mail'))->toBe("sent\n");
        if (! $samePayment) {
            expect(Subscription::where('status', 'active')->first()->expires_at->gte(now()->addMonthsNoOverflow(2)->subMinute()))->toBeTrue();
        }
    } finally {
        DB::disconnect('lifecycle_test');
        config(['database.default' => $original]);
        foreach ([$path, $path.'-wal', $path.'-shm', $path.'.mail'] as $temporary) {
            if (file_exists($temporary)) {
                unlink($temporary);
            }
        }
    }
})->with([true, false]);

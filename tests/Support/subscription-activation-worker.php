<?php

use App\Domains\Billing\Application\UseCases\ActivateSubscription;
use App\Domains\Billing\Domain\Events\SubscriptionActivated;
use App\Domains\Billing\Infrastructure\Jobs\SendSubscriptionNotice;
use App\Domains\Billing\Services\SubscriptionEntitlements;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
config([
    'database.default' => 'sqlite', 'database.connections.sqlite.database' => $argv[1],
    'cache.default' => 'array', 'queue.default' => 'sync', 'mail.default' => 'array',
]);
DB::purge('sqlite');
DB::statement('PRAGMA busy_timeout = 5000');
Event::fake([SubscriptionActivated::class]);
while (microtime(true) < (float) $argv[4]) {
    usleep(1000);
}
try {
    if (($argv[5] ?? null) === 'notice') {
        Event::listen(MessageSent::class, function () use ($argv) {
            file_put_contents($argv[1].'.mail', "sent\n", FILE_APPEND | LOCK_EX);
        });
        (new SendSubscriptionNotice((int) $argv[2]))->handle(app(SubscriptionEntitlements::class));
        exit(0);
    }
    $result = app(ActivateSubscription::class)->execute((int) $argv[2], ['paymentId' => $argv[3]]);
    echo $result ? 'activated' : 'already-processed';
} catch (Throwable $exception) {
    fwrite(STDERR, get_class($exception).': '.$exception->getMessage());
    exit(1);
}

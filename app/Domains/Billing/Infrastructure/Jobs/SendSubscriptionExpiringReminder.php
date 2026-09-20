<?php

namespace App\Domains\Billing\Infrastructure\Jobs;

use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Services\SubscriptionLifecycle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendSubscriptionExpiringReminder implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 45;

    public int $uniqueFor = 3600;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 60, 300];

    public function __construct(
        public readonly int $daysBeforeExpiry,
    ) {}

    public function handle(SubscriptionRepository $repo): void
    {
        // Compatibility entry point: the durable lifecycle outbox owns reminder deduplication.
        app(SubscriptionLifecycle::class)->process();
    }

    public function uniqueId(): string
    {
        return (string) $this->daysBeforeExpiry;
    }
}

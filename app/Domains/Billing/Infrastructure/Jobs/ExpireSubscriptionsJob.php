<?php

namespace App\Domains\Billing\Infrastructure\Jobs;

use App\Domains\Billing\Application\UseCases\ExpireSubscriptions;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptionsJob implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 45;

    public int $uniqueFor = 3600;

    /**
     * @var list<int>
     */
    public array $backoff = [10, 60, 300];

    public function handle(ExpireSubscriptions $useCase): void
    {
        $count = $useCase->execute();

        Log::info("[ExpireSubscriptionsJob] Expired {$count} subscription(s).");
    }
}

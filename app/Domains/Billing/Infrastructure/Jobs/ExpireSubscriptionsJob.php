<?php

namespace App\Domains\Billing\Infrastructure\Jobs;

use App\Domains\Billing\Application\UseCases\ExpireSubscriptions;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function handle(ExpireSubscriptions $useCase): void
    {
        $count = $useCase->execute();

        Log::info("[ExpireSubscriptionsJob] Expired {$count} subscription(s).");
    }
}

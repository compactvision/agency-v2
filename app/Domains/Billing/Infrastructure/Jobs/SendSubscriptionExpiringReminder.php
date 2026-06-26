<?php

namespace App\Domains\Billing\Infrastructure\Jobs;

use App\Domains\Billing\Infrastructure\Mail\SubscriptionExpiringMail;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionExpiringReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public readonly int $daysBeforeExpiry,
    ) {}

    public function handle(SubscriptionRepository $repo): void
    {
        $targetDate = now()->addDays($this->daysBeforeExpiry)->toDateString();

        $subscriptions = $repo->findExpiringOn($targetDate);

        foreach ($subscriptions as $sub) {
            if (!$sub->user?->email) {
                continue;
            }

            Mail::to($sub->user->email)->queue(
                new SubscriptionExpiringMail($sub, $this->daysBeforeExpiry)
            );
        }
    }
}

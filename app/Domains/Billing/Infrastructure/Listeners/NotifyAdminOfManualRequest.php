<?php

namespace App\Domains\Billing\Infrastructure\Listeners;

use App\Domains\Billing\Domain\Events\ManualSubscriptionRequested;
use App\Domains\Billing\Infrastructure\Mail\ManualSubscriptionAdminMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class NotifyAdminOfManualRequest implements ShouldQueue
{
    public function handle(ManualSubscriptionRequested $event): void
    {
        $adminEmail = config('mail.admin_address', config('mail.from.address'));

        Mail::to($adminEmail)->send(new ManualSubscriptionAdminMail(
            userId: $event->userId,
            planName: $event->planName,
            subscriptionId: $event->subscriptionId,
        ));
    }
}

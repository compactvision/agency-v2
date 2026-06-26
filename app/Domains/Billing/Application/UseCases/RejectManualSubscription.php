<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\RejectSubscriptionCommand;
use App\Domains\Billing\Domain\ValueObjects\SubscriptionStatus;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use Illuminate\Support\Facades\Log;

class RejectManualSubscription
{
    public function __construct(
        private readonly SubscriptionRepository $subscriptions,
    ) {}

    public function execute(RejectSubscriptionCommand $cmd): void
    {
        $sub = $this->subscriptions->findOrFail($cmd->subscriptionId);

        if ($sub->status !== SubscriptionStatus::Pending->value) {
            Log::warning("Tried to reject non-pending subscription #{$cmd->subscriptionId}");
            return;
        }

        $sub->update([
            'status'         => SubscriptionStatus::Failed->value,
            'failure_reason' => $cmd->reason ?: 'Rejected by admin',
        ]);
    }
}

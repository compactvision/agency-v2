<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\ApproveSubscriptionCommand;

class ApproveManualSubscription
{
    public function execute(ApproveSubscriptionCommand $cmd): void
    {
        app(ActivateSubscription::class)->execute($cmd->subscriptionId, ['approvedBy' => $cmd->adminId]);
    }
}

<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\RejectSubscriptionCommand;
use App\Domains\Billing\Models\Subscription;
use App\Models\User;
use App\Support\AuditLogger;
use DomainException;
use Illuminate\Support\Facades\DB;

class RejectManualSubscription
{
    public function execute(RejectSubscriptionCommand $cmd): void
    {
        if (! User::find($cmd->adminId)?->hasRole(['admin', 'super-admin'])) {
            throw new DomainException('Administrator confirmation is required.');
        }
        $candidate = Subscription::findOrFail($cmd->subscriptionId);
        DB::transaction(function () use ($cmd, $candidate) {
            User::whereKey($candidate->user_id)->lockForUpdate()->firstOrFail();
            $sub = Subscription::whereKey($candidate->id)->lockForUpdate()->firstOrFail();
            if ($sub->payment_method === 'RDCard' || ! in_array($sub->status, ['pending', 'failed'])) {
                throw new DomainException('This subscription cannot be manually rejected.');
            }
            $before = $sub->only(['status', 'failure_reason']);
            $sub->update(['status' => 'cancelled', 'failure_reason' => $cmd->reason ?: 'Rejected by administrator', 'cancelled_at' => now()]);
            app(AuditLogger::class)->record('subscription.rejected', $sub, $cmd->reason, $before, $sub->only(['status', 'failure_reason']), 'warning');
        }, 3);
    }
}

<?php

namespace App\Policies;

use App\Domains\Billing\Models\Subscription;
use App\Models\User;

class SubscriptionPolicy
{
    public function view(User $user, Subscription $subscription): bool
    {
        return $subscription->user_id === $user->id || $this->manage($user);
    }

    public function manage(User $user): bool
    {
        return $user->hasRole(['admin', 'super-admin']);
    }
}

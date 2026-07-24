<?php

namespace App\Policies;

use App\Domains\Ads\Models\Ad;
use App\Models\User;

class AdPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->hasRole(['admin', 'super-admin']) ? true : null;
    }

    public function view(User $user, Ad $ad): bool
    {
        return $ad->user_id === $user->id;
    }

    public function update(User $user, Ad $ad): bool
    {
        return $ad->user_id === $user->id;
    }

    public function submit(User $user, Ad $ad): bool
    {
        return $ad->user_id === $user->id;
    }

    public function manageImages(User $user, Ad $ad): bool
    {
        return $ad->user_id === $user->id;
    }

    public function moderate(User $user, Ad $ad): bool
    {
        return false;
    }
}

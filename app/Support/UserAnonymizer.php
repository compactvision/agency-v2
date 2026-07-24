<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserAnonymizer
{
    public function anonymize(User $user): bool
    {
        if ($user->anonymized_at !== null) {
            return false;
        }

        $profilePhoto = $user->profile_photo;
        $originalEmail = $user->email;
        $anonymizedEmail = "deleted+{$user->id}@anonymized.invalid";

        DB::transaction(function () use ($user, $originalEmail, $anonymizedEmail) {
            $user->tokens()->delete();
            $user->favorites()->detach();
            $user->notifications()->delete();
            $user->syncRoles([]);

            DB::table('sessions')->where('user_id', $user->id)->delete();
            DB::table('password_reset_tokens')->where('email', $originalEmail)->delete();

            $user->newsletter_subscription()->update([
                'email' => "deleted-newsletter+{$user->id}@anonymized.invalid",
                'user_id' => null,
                'is_active' => false,
            ]);

            foreach ($user->ads()->get() as $ad) {
                $ad->update([
                    'status' => 'archived',
                    'is_published' => false,
                    'is_approved' => false,
                ]);
                $ad->delete();
            }

            $user->forceFill([
                'name' => "Utilisateur supprimé #{$user->id}",
                'email' => $anonymizedEmail,
                'email_verified_at' => null,
                'password' => Hash::make(Str::random(64)),
                'remember_token' => null,
                'phone' => null,
                'profile_photo' => null,
                'country_id' => null,
                'city_id' => null,
                'municipality_id' => null,
                'address' => null,
                'bio' => null,
                'company' => null,
                'rc_number' => null,
                'tax_number' => null,
                'user_type' => null,
                'is_seller' => false,
                'notifications_enabled' => false,
                'facebook' => null,
                'twitter' => null,
                'instagram' => null,
                'linkedin' => null,
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
                'anonymized_at' => now(),
            ])->save();
        }, 3);

        if ($profilePhoto) {
            Storage::disk('public')->delete($profilePhoto);
        }

        return true;
    }
}

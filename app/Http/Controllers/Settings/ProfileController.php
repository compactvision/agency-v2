<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Support\UserAnonymizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct(
        private readonly UserAnonymizer $userAnonymizer,
    ) {}

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Remove newsletter from user fill data (it's not a user column)
        $newsletter = isset($data['newsletter']) ? (bool) $data['newsletter'] : null;
        unset($data['newsletter']);

        if ($request->hasFile('profile_photo')) {
            $oldProfilePhoto = $user->profile_photo;
            $data['profile_photo'] = $request->file('profile_photo')->store('profile-photos', 'public');
        } else {
            $oldProfilePhoto = null;
        }

        // Cast boolean explicitly to avoid PHP falsy issues
        if (isset($data['notifications_enabled'])) {
            $data['notifications_enabled'] = filter_var($data['notifications_enabled'], FILTER_VALIDATE_BOOLEAN);
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($oldProfilePhoto) {
            Storage::disk('public')->delete($oldProfilePhoto);
        }

        if ($newsletter !== null) {
            $user->newsletter_subscription()->updateOrCreate(
                ['email' => $user->email],
                ['is_active' => $newsletter]
            );
        }

        return to_route('dashboard.users.profile')->with('success', __('profile_updated_success'));
    }

    /**
     * Update the user's profile photo.
     */
    public function updateProfilePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_photo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048', 'dimensions:max_width=5000,max_height=5000'],
        ]);

        $user = $request->user();

        $oldProfilePhoto = $user->profile_photo;
        $path = $request->file('profile_photo')->store('profile-photos', 'public');
        $user->profile_photo = $path;
        $user->save();

        if ($oldProfilePhoto) {
            Storage::disk('public')->delete($oldProfilePhoto);
        }

        return back()->with('status', 'profile-photo-updated');
    }

    /**
     * Delete the user's profile photo.
     */
    public function deleteProfilePhoto(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
            $user->profile_photo = null;
            $user->save();
        }

        return back()->with('status', 'profile-photo-deleted');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $this->userAnonymizer->anonymize($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

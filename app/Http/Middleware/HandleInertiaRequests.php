<?php

namespace App\Http\Middleware;

use App\Domains\System\Models\SystemSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user()?->load(['roles', 'newsletter_subscription']);

        // Build the user data array with profile_photo_url computed (not stored on model)
        $userData = null;
        if ($user) {
            $userData = array_merge($user->toArray(), [
                'profile_photo_url' => $user->profile_photo
                    ? asset('storage/'.$user->profile_photo)
                    : null,
            ]);
        }

        $permissions = $request->user()?->hasRole('super-admin')
            ? collect(config('role_permissions.permissions', []))
            : ($request->user()?->getAllPermissions()->pluck('name') ?? collect());

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $userData,
                'roles' => $request->user()?->getRoleNames() ?? [],
                'permissions' => $permissions,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'settings' => SystemSetting::where('key', 'site_settings')->first()?->value ?? [],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'status' => fn () => $request->session()->get('status'),
        ];
    }
}

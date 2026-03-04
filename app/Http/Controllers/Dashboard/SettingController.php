<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Domains\System\Models\SystemSetting;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::where('key', 'site_settings')->first()?->value ?? [];

        return Inertia::render('dashboard/settings/Settings', [
            'user' => auth()->user(),
            'settings' => $settings,
            'userRoles' => auth()->user()->roles->pluck('name')->toArray(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'app_email' => 'nullable|email|max:255',
            'numero'    => 'nullable|string|max:255',
            'adresse'   => 'nullable|string|max:500',
            'facebook'  => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'twitter'   => 'nullable|string|max:255',
            'linkedin'  => 'nullable|string|max:255',
        ]);

        SystemSetting::updateOrCreate(
            ['key' => 'site_settings'],
            ['value' => $validated]
        );

        return back()->with('success', 'Paramètres mis à jour avec succès');
    }
}

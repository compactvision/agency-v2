<?php

namespace App\Domains\System\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Domains\System\Models\SystemSetting;

class CheckMaintenance
{
    public function handle(Request $request, Closure $next)
    {
        $setting = SystemSetting::where('key', 'maintenance')->first();

        if (!$setting || empty($setting->value['enabled'])) {
            return $next($request);
        }

        // Super admin bypass
        if ($request->user()?->hasRole('super-admin')) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => $setting->value['message'] ?? 'System under maintenance',
        ], 503);
    }
}

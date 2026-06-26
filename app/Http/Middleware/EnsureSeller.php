<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSeller
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->hasRole('seller')) {
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Seller access required',
                ], 403);
            }

            abort(403, 'Seller access required');
        }

        return $next($request);
    }
}

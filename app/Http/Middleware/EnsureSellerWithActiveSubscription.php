<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSellerWithActiveSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !$user->hasRole('seller')) {
            return response()->json([
                'success' => false,
                'message' => 'Seller access required',
            ], 403);
        }

        if (
            !$user->subscription ||
            $user->subscription->status !== 'active'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Active subscription required',
            ], 403);
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Ensures the authenticated user is a seller with a currently active subscription.
 * "Active" means status = 'active' AND expires_at is in the future (or null).
 */
class EnsureSellerWithActiveSubscription
{
    public function handle(Request $request, Closure $next): mixed
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

        $sub = $user->subscription;

        // Check status AND expiry date — previously only checked status
        if (!$sub || $sub->status !== 'active' || ($sub->expires_at && $sub->expires_at->isPast())) {
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json([
                    'success' => false,
                    'message' => 'An active subscription is required to perform this action.',
                ], 403);
            }

            abort(403, 'An active subscription is required to perform this action.');
        }

        return $next($request);
    }
}

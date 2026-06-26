<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->hasRole(['admin', 'super-admin'])) {
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to perform this action',
                ], 403);
            }

            abort(403, 'You are not authorized to perform this action');
        }

        return $next($request);
    }
}

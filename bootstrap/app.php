<?php

use App\Domains\System\Middleware\CheckMaintenance;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\EnsureSeller;
use App\Http\Middleware\EnsureSellerWithActiveSubscription;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // 🌐 WEB
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            SecurityHeaders::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->api(append: [
            SecurityHeaders::class,
        ]);

        // ✅ Aliases
        $middleware->alias([
            'maintenance' => CheckMaintenance::class,
            'admin' => AdminMiddleware::class,
            'seller' => EnsureSeller::class,
            'seller.active' => EnsureSellerWithActiveSubscription::class,

            // Spatie
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        // 1) Validation JSON
        $exceptions->render(function (ValidationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // 2) Model not found
        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found',
                ], 404);
            }
        });

        // 3) 403
        $exceptions->render(function (AuthorizationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to perform this action',
                ], 403);
            }
        });

        // 4) 401
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }
        });

        // 5) Preserve HTTP status codes such as 404, 405 and 429
        $exceptions->render(function (HttpExceptionInterface $e, $request) {
            if ($request->is('api/*')) {
                $status = $e->getStatusCode();

                return response()->json([
                    'success' => false,
                    'message' => Response::$statusTexts[$status] ?? 'Request failed',
                ], $status, $e->getHeaders());
            }
        });

        // 6) Unexpected server errors
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Internal server error',
                    'error' => app()->environment('local') ? $e->getMessage() : null,
                ], 500);
            }
        });

    })->create();

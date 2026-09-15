<?php

namespace App\Domains\Billing\Controllers;

use App\Domains\Billing\Requests\StartSubscriptionRequest;
use App\Domains\Billing\Services\BillingService;
use App\Domains\Billing\Services\SubscriptionManager;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BillingController
{
    public function __construct(
        protected BillingService $billing,
        protected SubscriptionManager $subscriptions
    ) {}

    /**
     * 1. Start payment
     */
    public function start(StartSubscriptionRequest $request)
    {
        if (! $request->user()->hasAnyRole(['seller', 'agency', 'admin'])) {
            return ApiResponse::error(
                'Vous devez d’abord devenir vendeur pour pouvoir souscrire un abonnement.',
                403,
                'SELLER_REQUIRED'
            );
        }

        try {
            $userId = $request->user()->id;
            $planId = $request->validated()['plan_id'];

            $result = $this->billing->startSubscription($userId, $planId);

            if ($result['status'] === 'manual_pending') {
                return ApiResponse::success([
                    'status' => 'manual_pending',
                    'message' => 'Votre demande d’abonnement est en cours de vérification par l’administrateur.',
                ], 'Manual subscription requested', 201);
            }

            return ApiResponse::success($result, 'Payment session created', 201);
        } catch (\Throwable $e) {
            if ($e->getMessage() === 'ALREADY_HAS_SUBSCRIPTION') {
                return ApiResponse::error(
                    'Vous avez déjà un abonnement actif. Voulez-vous passer à celui-ci ?',
                    422,
                    'ALREADY_HAS_SUBSCRIPTION'
                );
            }

            report($e);

            return ApiResponse::error(
                'Le paiement est momentanément indisponible. Veuillez réessayer.',
                503,
                'START_PAYMENT_ERROR',
            );
        }
    }

    /**
     * 2. Front redirection — success
     */
    public function success()
    {
        return ApiResponse::success(null, 'Payment success — pending confirmation');
    }

    /**
     * 3. Front redirection — cancel
     */
    public function cancel()
    {
        return ApiResponse::success(null, 'Payment cancelled');
    }

    /**
     * 4. Get current subscription
     */
    public function current(Request $request)
    {
        $sub = $request->user()->subscription;

        if (! $sub) {
            return ApiResponse::success(null, 'No active subscription');
        }

        return ApiResponse::success(
            $sub->load('plan'),
            'Subscription retrieved'
        );
    }
}

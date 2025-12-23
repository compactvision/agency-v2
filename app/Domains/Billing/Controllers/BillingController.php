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
        try {
            $userId = $request->user()->id;
            $planId = $request->validated()['plan_id'];

            $result = $this->billing->startSubscription($userId, $planId);

            return ApiResponse::success($result, 'Payment session created', 201);
        } catch (\Throwable $e) {
            if (app()->isLocal()) {
                return ApiResponse::error($e->getMessage(), 500, 'START_PAYMENT_ERROR');
            }

            return ApiResponse::error('Unable to start payment', 500, 'START_PAYMENT_ERROR');
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

        if (!$sub) {
            return ApiResponse::success(null, 'No active subscription');
        }

        return ApiResponse::success(
            $sub->load('plan'),
            'Subscription retrieved'
        );
    }
}

<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Plan;

class BillingService
{
    public function __construct(
        protected PaymentGatewayService $gateway,
        protected SubscriptionManager $subscriptionManager
    ) {}

    /**
     * Start a payment session
     */
    public function startSubscription(int $userId, int $planId): array
    {
        $plan = Plan::findOrFail($planId);

        // URLs
        $successUrl   = route('billing.success');
        $cancelUrl    = route('billing.cancel');
        $callbackUrl  = route('webhooks.acoriss');

        // Create subscription in pending status
        $subscription = $this->subscriptionManager->createPending($userId, $plan);

        // Fake OR real gateway depending on environment
        $sessionData = $this->gateway->createSession([
            'amount'        => $plan->price * 100,
            'currency'      => 'USD',
            'callbackUrl'   => $callbackUrl,
            'successUrl'    => $successUrl,
            'cancelUrl'     => $cancelUrl,
            'transactionId' => $subscription->transaction_id,
            'services' => [
                [
                    'name'        => $plan->name,
                    'price'       => $plan->price * 100,
                    'description' => "Subscription to {$plan->name}",
                    'quantity'    => 1,
                ]
            ]
        ]);

        // Attach session id
        $this->subscriptionManager->attachPaymentSession(
            $subscription,
            $sessionData['sessionId']
        );

        return [
            'checkout_url'   => $sessionData['checkoutUrl'],
            'transaction_id' => $subscription->transaction_id,
        ];
    }
}

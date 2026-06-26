<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Domain\Events\ManualSubscriptionRequested;
use App\Models\User;

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

        // Check for existing active subscription
        $user = User::find($userId);
        if ($user->subscription && $user->subscription->is_active) {
            throw new \Exception('ALREADY_HAS_SUBSCRIPTION');
        }

        // If manual payment method
        if ($plan->payment_method === 'manual') {
            $subscription = $this->subscriptionManager->createPending($userId, $plan);
            
            // Trigger event/notification for manual request
            event(new ManualSubscriptionRequested(
                $userId,
                $plan->id,
                $plan->name,
                $subscription->id
            ));

            return [
                'status'         => 'manual_pending',
                'transaction_id' => $subscription->transaction_id,
            ];
        }

        // Automatic payment (Gateway)
        $successUrl   = route('billing.success');
        $cancelUrl    = route('billing.cancel');
        $callbackUrl  = route('webhooks.acoriss');

        $subscription = $this->subscriptionManager->createPending($userId, $plan);

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

        $this->subscriptionManager->attachPaymentSession(
            $subscription,
            $sessionData['sessionId']
        );

        return [
            'status'         => 'automatic_redirect',
            'checkout_url'   => $sessionData['checkoutUrl'],
            'transaction_id' => $subscription->transaction_id,
        ];
    }
}

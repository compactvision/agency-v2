<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\StartAutomaticSubscriptionCommand;
use App\Domains\Billing\Infrastructure\Gateways\Contracts\PaymentGatewayInterface;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;
use App\Domains\Billing\Infrastructure\Repositories\PlanRepository;

class StartAutomaticSubscription
{
    public function __construct(
        private readonly PaymentGatewayInterface $gateway,
        private readonly SubscriptionRepository  $subscriptions,
        private readonly PlanRepository          $plans,
    ) {}

    /**
     * @return string The checkout URL to redirect the user to
     */
    public function execute(StartAutomaticSubscriptionCommand $cmd): string
    {
        $plan = $this->plans->findOrFail($cmd->planId);

        $subscription = $this->subscriptions->createPending($cmd->userId, $plan);

        $session = $this->gateway->createSession([
            'amount'        => $plan->price * 100,
            'currency'      => 'USD',
            'transactionId' => $subscription->transaction_id,
            'callbackUrl'   => route('webhooks.acoriss'),
            'successUrl'    => route('billing.success'),
            'cancelUrl'     => route('billing.cancel'),
            'services'      => [
                [
                    'name'        => $plan->name,
                    'price'       => $plan->price * 100,
                    'description' => "Abonnement {$plan->name}",
                    'quantity'    => 1,
                ]
            ],
        ]);

        $subscription->update(['payment_session_id' => $session['sessionId']]);

        return $session['checkoutUrl'];
    }
}

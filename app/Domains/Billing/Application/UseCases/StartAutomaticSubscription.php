<?php

namespace App\Domains\Billing\Application\UseCases;

use App\Domains\Billing\Application\Commands\StartAutomaticSubscriptionCommand;
use App\Domains\Billing\Infrastructure\Gateways\Contracts\PaymentGatewayInterface;
use App\Domains\Billing\Infrastructure\Repositories\PlanRepository;
use App\Domains\Billing\Infrastructure\Repositories\SubscriptionRepository;

class StartAutomaticSubscription
{
    public function __construct(
        private readonly PaymentGatewayInterface $gateway,
        private readonly SubscriptionRepository $subscriptions,
        private readonly PlanRepository $plans,
    ) {}

    /**
     * @return string The checkout URL to redirect the user to
     */
    public function execute(StartAutomaticSubscriptionCommand $cmd): string
    {
        $plan = $this->plans->findOrFail($cmd->planId);

        if (! $plan->is_active || $plan->payment_method !== 'automatic') {
            throw new \DomainException('This plan does not support automatic payments.');
        }

        $subscription = $this->subscriptions->createPending($cmd->userId, $plan);

        $subscription->update(['payment_method' => 'RDCard']);

        $session = $this->gateway->createSession([
            'amount' => (float) $plan->price,
            'currency' => 'USD',
            'customer' => [
                'name' => $subscription->user->name,
                'email' => $subscription->user->email,
            ],
            'transactionId' => $subscription->transaction_id,
            'callbackUrl' => route('webhooks.rdcard'),
            'successUrl' => route('billing.return', ['transaction' => $subscription->transaction_id]),
            'cancelUrl' => route('billing.cancel.return', ['transaction' => $subscription->transaction_id]),
            'services' => [
                [
                    'name' => $plan->name,
                    'price' => (float) $plan->price,
                    'description' => "Abonnement {$plan->name}",
                    'quantity' => 1,
                ],
            ],
        ]);

        $subscription->update(['payment_session_id' => $session['sessionId']]);

        return $session['checkoutUrl'];
    }
}

<?php

namespace App\Domains\Billing\Infrastructure\Gateways\Contracts;

interface PaymentGatewayInterface
{
    /**
     * Create a payment checkout session.
     *
     * @param  array $payload
     * @return array{sessionId: string, checkoutUrl: string}
     */
    public function createSession(array $payload): array;

    /**
     * Get the current status of a payment by session ID.
     *
     * @param  string $sessionId
     * @return array
     */
    public function getPaymentStatus(string $sessionId): array;
}

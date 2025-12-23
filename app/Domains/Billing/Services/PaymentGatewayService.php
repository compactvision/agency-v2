<?php

namespace App\Domains\Billing\Services;

use Illuminate\Support\Facades\Http;

class PaymentGatewayService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('billing.acoriss.base_url');
        $this->apiKey  = config('billing.acoriss.api_key');

        if (!$this->baseUrl || !$this->apiKey) {
            throw new \Exception("Missing Acoriss configuration. Check billing.php config.");
        }
    }

    /**
     * Fake or real payment session creator
     */
    public function createSession(array $payload): array
    {
        if (app()->environment('local')) {
            // No HTTP call in local
            $mock = app(\App\Domains\Billing\Controllers\MockPaymentController::class);
            $response = $mock->createSession(request()->merge($payload));
            return $response->getData(true);
        }

        // Prod request
        $response = Http::withToken($this->apiKey)
            ->post("{$this->baseUrl}/checkout/create-session", $payload);

        if (!$response->successful()) {
            throw new \Exception($response->body());
        }

        return $response->json();
    }

    /**
     * Retrieve payment status
     */
    public function getPaymentStatus(string $sessionId): array
    {
        if (app()->environment('local')) {
            $mock = app(\App\Domains\Billing\Controllers\MockPaymentController::class);
            return $mock->getPayment($sessionId)->getData(true);
        }

        $response = Http::withToken($this->apiKey)
            ->get("{$this->baseUrl}/payment/{$sessionId}");

        if (!$response->successful()) {
            throw new \Exception($response->body());
        }

        return $response->json();
    }
}

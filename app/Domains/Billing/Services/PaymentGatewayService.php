<?php

namespace App\Domains\Billing\Services;

use App\Domains\Billing\Infrastructure\Gateways\Contracts\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PaymentGatewayService implements PaymentGatewayInterface
{
    public function createSession(array $payload): array
    {
        $payload['redirectUrl'] ??= $payload['successUrl'];
        if ($serviceId = config('billing.rdcard.service_id')) {
            $payload['serviceId'] = $serviceId;
        }

        $session = $this->send('POST', '/v1/sessions', $payload);
        $url = $session['checkoutUrl'] ?? null;
        if (! is_string($session['id'] ?? null) || $session['id'] === ''
            || ! is_string($url) || ! filter_var($url, FILTER_VALIDATE_URL)
            || parse_url($url, PHP_URL_SCHEME) !== 'https'
            || parse_url($url, PHP_URL_HOST) !== parse_url($this->baseUrl(), PHP_URL_HOST)) {
            throw new RuntimeException('Invalid RDCard checkout response.');
        }

        return ['sessionId' => $session['id'], 'checkoutUrl' => $url];
    }

    public function getPaymentStatus(string $sessionId): array
    {
        return $this->send('GET', '/v1/sessions/'.rawurlencode($sessionId), signatureData: $sessionId);
    }

    public function baseUrl(): string
    {
        $override = config('billing.rdcard.base_url');
        if (is_string($override) && $override !== '') {
            return rtrim($override, '/');
        }

        return match (config('billing.rdcard.environment', 'sandbox')) {
            'sandbox' => 'https://sandbox.checkout.rdcard.net/api',
            'live' => 'https://checkout.rdcard.net/api',
            default => throw new RuntimeException('Invalid RDCard environment. Use sandbox or live.'),
        };
    }

    private function send(string $method, string $path, ?array $payload = null, ?string $signatureData = null): array
    {
        $baseUrl = $this->baseUrl();
        $key = config('billing.rdcard.api_key');
        $secret = config('billing.rdcard.secret');
        if (! is_string($baseUrl) || ! $baseUrl || ! is_string($key) || ! $key
            || ! is_string($secret) || ! $secret) {
            throw new RuntimeException('Missing RDCard configuration.');
        }

        // Match the SDK: POST signs raw JSON; GET signs the payment ID.
        $body = $payload === null ? '' : json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $response = Http::acceptJson()
            ->withHeaders([
                'X-API-KEY' => $key,
                'X-SIGNATURE' => hash_hmac('sha256', $signatureData ?? $body, $secret),
            ])
            ->connectTimeout(5)->timeout(20)
            ->withoutRedirecting()
            ->withBody($body, 'application/json')
            ->send($method, rtrim($baseUrl, '/').$path);

        if (! $response->successful() || ! is_array($response->json())) {
            // Do not expose provider response bodies, which may contain customer data.
            throw new RuntimeException('RDCard request failed (HTTP '.$response->status().').');
        }

        return $response->json();
    }
}

<?php

namespace App\Domains\Billing\Controllers;

use App\Domains\Billing\Models\Subscription;
use App\Domains\Billing\Services\PaymentGatewayService;
use App\Domains\Billing\Services\RdcardPaymentService;
use Illuminate\Http\Request;

class RdcardReturnController
{
    public function __invoke(Request $request, PaymentGatewayService $gateway, RdcardPaymentService $payments)
    {
        $request->validate(['transaction' => ['required', 'string', 'max:255']]);
        $subscription = Subscription::where('user_id', $request->user()->id)
            ->where('transaction_id', $request->input('transaction'))
            ->where('payment_method', 'RDCard')
            ->firstOrFail();

        try {
            if ($subscription->payment_session_id) {
                $payment = $gateway->getPaymentStatus($subscription->payment_session_id);
                $event = match ($payment['status'] ?? null) {
                    'S' => 'payment.succeeded',
                    'C' => 'payment.canceled',
                    'P' => 'payment.initialized',
                    default => throw new \DomainException('Unknown RDCard payment status.'),
                };
                $payments->apply($subscription, $payment, $event);
            }
        } catch (\Throwable $exception) {
            report($exception);
        }

        $subscription->refresh();
        [$level, $message] = match ($subscription->status) {
            'active' => ['success', 'Paiement confirmé. Votre abonnement est actif.'],
            'failed' => ['error', 'Le paiement a été annulé ou refusé. Vous pouvez réessayer.'],
            default => ['info', 'Votre paiement est en cours de confirmation. Consultez le statut de votre abonnement dans quelques instants.'],
        };

        return redirect()->route('dashboard.subscriptions.index')->with($level, $message);
    }
}

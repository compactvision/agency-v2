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

        // Keep old checkout sessions using ?cancelled=1 compatible.
        if ($request->routeIs('billing.cancel.return') || $request->boolean('cancelled')) {
            $payments->cancelAttempt($subscription);
        }

        return redirect()->route('billing.result', ['transaction' => $subscription->transaction_id]);
    }
}

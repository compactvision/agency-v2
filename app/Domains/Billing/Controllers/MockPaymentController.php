<?php

namespace App\Domains\Billing\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MockPaymentController
{
    public function createSession(Request $request)
    {
        return response()->json([
            'checkoutUrl'    => 'https://mock-payment.local/checkout/' . Str::uuid(),
            'sessionId'      => 'mock_session_' . Str::random(10),
            'transactionId'  => $request->transactionId ?? ('mock_tx_' . Str::random(8)),
        ]);
    }

    public function getPayment(string $sessionId)
    {
        return response()->json([
            'sessionId' => $sessionId,
            'status'    => 'succeeded',
            'paymentId' => 'pay_' . Str::random(6),
            'amount'    => 5000,
            'currency'  => 'USD',
        ]);
    }

    public function webhook(Request $request)
    {
        return response()->json([
            'received' => true,
            'mock'     => true,
            'event'    => $request->all(),
        ], 200);
    }
}

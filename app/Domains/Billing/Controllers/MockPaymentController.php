<?php

namespace App\Domains\Billing\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MockPaymentController
{
    public function createSession(Request $request)
    {
        $transactionId = $request->transactionId ?? ('mock_tx_' . Str::random(8));

        return response()->json([
            'checkoutUrl'    => route('demo.gateway', ['transactionId' => $transactionId]),
            'sessionId'      => 'mock_session_' . Str::random(10),
            'transactionId'  => $transactionId,
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

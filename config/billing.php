<?php

return [
    'acoriss' => [
        'base_url' => env('ACORISS_BASE_URL', 'https://api.acoriss.com'),
        'api_key' => env('ACORISS_API_KEY'),
        'secret' => env('ACORISS_SECRET'),
        'webhook_secret' => env('ACORISS_WEBHOOK_SECRET'),
        'webhook_signature_header' => env('ACORISS_WEBHOOK_SIGNATURE_HEADER', 'X-Acoriss-Signature'),
        'webhook_amount_multiplier' => (int) env('ACORISS_WEBHOOK_AMOUNT_MULTIPLIER', 100),
    ],
];

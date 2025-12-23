<?php

return [
    'acoriss' => [
        'base_url'       => env('ACORISS_BASE_URL', 'https://api.acoriss.com'),
        'api_key'        => env('ACORISS_API_KEY', 'fake_key_for_local'),
        'secret'         => env('ACORISS_SECRET', 'fake_secret_for_local'),
        'webhook_secret' => env('ACORISS_WEBHOOK_SECRET', 'fake_webhook_secret_for_local'),
    ],
];

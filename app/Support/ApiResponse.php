<?php

namespace App\Support;

class ApiResponse
{
    public static function success($data = null, ?string $message = null, int $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function error(
        string $message,
        int $status = 400,
        ?string $code = null,
        $errors = null,
    ) {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => $code,
            'errors' => $errors,
        ], $status);
    }
}

<?php

namespace App\Domains\Quotas\Controllers;

use App\Support\ApiResponse;
use App\Domains\Quotas\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuotaController
{
    public function __construct(
        protected QuotaService $quota
    ) {}

    /**
     * GET /quota/status
     */
    public function status()
    {
        $user = Auth::user();
        $sub = $user->subscription;

        $result = $this->quota->check($user->id, $sub);

        return ApiResponse::success($result, "Quota status");
    }

    /**
     * POST /quota/consume
     */
    public function consume(Request $request)
    {
        $data = $request->validate([
            'amount' => ['required', 'integer', 'min:1']
        ]);

        $user = Auth::user();
        $sub = $user->subscription;

        $result = $this->quota->consume($user->id, $sub, $data['amount']);

        return ApiResponse::success($result, "Quota consumed");
    }

    /**
     * POST /quota/reset (ADMIN ONLY)
     */
    public function reset(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'plan_id' => ['required', 'exists:plans,id']
        ]);

        $this->quota->reset($data['user_id'], $data['plan_id']);

        return ApiResponse::success(null, "Quota reset");
    }
}

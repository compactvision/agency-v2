<?php

namespace App\Domains\System\Controllers;

use App\Support\ApiResponse;
use App\Domains\System\Services\MaintenanceService;
use Illuminate\Http\Request;

class MaintenanceController
{
    public function __construct(
        protected MaintenanceService $service
    ) {}

    public function status()
    {
        return ApiResponse::success(
            $this->service->status(),
            'System status'
        );
    }

    public function enable(Request $request)
    {
        $data = $request->validate([
            'message' => ['nullable', 'string', 'max:255'],
        ]);

        return ApiResponse::success(
            $this->service->enable($data['message'] ?? 'System under maintenance'),
            'Maintenance enabled'
        );
    }

    public function disable()
    {
        return ApiResponse::success(
            $this->service->disable(),
            'Maintenance disabled'
        );
    }
}

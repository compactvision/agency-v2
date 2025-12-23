<?php

namespace App\Domains\System\Services;

use App\Domains\System\Models\SystemSetting;

class MaintenanceService
{
    public function status(): array
    {
        $setting = SystemSetting::firstOrCreate(
            ['key' => 'maintenance'],
            ['value' => ['enabled' => false]]
        );

        return $setting->value;
    }

    public function enable(string $message = 'System under maintenance'): array
    {
        return SystemSetting::updateOrCreate(
            ['key' => 'maintenance'],
            ['value' => [
                'enabled' => true,
                'message' => $message,
            ]]
        )->value;
    }

    public function disable(): array
    {
        return SystemSetting::updateOrCreate(
            ['key' => 'maintenance'],
            ['value' => ['enabled' => false]]
        )->value;
    }
}

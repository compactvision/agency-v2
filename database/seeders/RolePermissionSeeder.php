<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissionNames = config('role_permissions.permissions', []);

        foreach ($permissionNames as $permissionName) {
            Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);
        }

        $allPermissions = Permission::query()
            ->whereIn('name', $permissionNames)
            ->pluck('name')
            ->all();

        Role::findOrCreate('super-admin', 'web')->syncPermissions($allPermissions);

        foreach (config('role_permissions.roles', []) as $roleName => $permissions) {
            Role::findOrCreate($roleName, 'web')
                ->syncPermissions($permissions === '*' ? $allPermissions : $permissions);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}

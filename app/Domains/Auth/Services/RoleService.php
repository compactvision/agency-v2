<?php

namespace App\Domains\Auth\Services;

use Spatie\Permission\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleService
{
    /**
     * List roles with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Role::query()->with('permissions');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new role.
     */
    public function create(array $data): Role
    {
        $role = Role::create(['name' => $data['name']]);
        
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    /**
     * Update an existing role.
     */
    public function update(Role $role, array $data): Role
    {
        $role->update(['name' => $data['name']]);
        
        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    /**
     * Delete a role with safety checks.
     */
    public function delete(Role $role): bool
    {
        if (in_array($role->name, ['admin', 'super-admin'])) {
            throw new \Exception('Impossible de supprimer un rôle système.');
        }

        return $role->delete();
    }
}

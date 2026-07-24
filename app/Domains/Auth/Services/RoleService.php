<?php

namespace App\Domains\Auth\Services;

use App\Support\AuditLogger;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        private readonly AuditLogger $auditLogger,
    ) {}

    /**
     * List roles with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Role::query()->with('permissions');

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new role.
     */
    public function create(array $data): Role
    {
        if (in_array($data['name'], ['admin', 'super-admin'], true)
            && ! auth()->user()->hasRole('super-admin')) {
            throw new AuthorizationException('Only a super administrator may create a privileged role.');
        }

        $role = Role::create(['name' => $data['name']]);

        if (! empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        $this->auditLogger->record(
            'role.created',
            $role,
            "Rôle {$role->name} créé.",
            newValues: [
                'name' => $role->name,
                'permissions' => $role->getPermissionNames()->all(),
            ],
            level: 'warning',
        );

        return $role;
    }

    /**
     * Update an existing role.
     */
    public function update(Role $role, array $data): Role
    {
        $before = [
            'name' => $role->name,
            'permissions' => $role->getPermissionNames()->all(),
        ];

        if (in_array($role->name, ['admin', 'super-admin'], true)
            && ! auth()->user()->hasRole('super-admin')) {
            throw new AuthorizationException('Only a super administrator may edit a privileged role.');
        }

        if ($role->name === 'super-admin' && $data['name'] !== 'super-admin') {
            throw new AuthorizationException('The super administrator role cannot be renamed.');
        }

        if ($data['name'] === 'super-admin' && $role->name !== 'super-admin') {
            throw new AuthorizationException('Another role cannot be promoted by renaming it.');
        }

        $role->update(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        $role->refresh();
        $this->auditLogger->record(
            'role.updated',
            $role,
            "Rôle {$role->name} mis à jour.",
            $before,
            [
                'name' => $role->name,
                'permissions' => $role->getPermissionNames()->all(),
            ],
            'warning',
        );

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

        $before = [
            'name' => $role->name,
            'permissions' => $role->getPermissionNames()->all(),
        ];
        $deleted = $role->delete();

        if ($deleted) {
            $this->auditLogger->record(
                'role.deleted',
                $role,
                "Rôle {$role->name} supprimé.",
                oldValues: $before,
                level: 'critical',
            );
        }

        return $deleted;
    }
}

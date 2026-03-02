<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Domains\Auth\Services\RoleService;
use App\Domains\Auth\Resources\RoleResource;
class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Administration
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $perPage = $request->input('per_page', 20);
        $roles = $this->roleService->list($request->only(['search']), $perPage);

        return Inertia::render('dashboard/roles/Roles', [
            'roles' => [
                'data' => RoleResource::collection($roles->items())->resolve(),
                'links' => $roles->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $roles->currentPage(),
                    'last_page' => $roles->lastPage(),
                    'total' => $roles->total(),
                    'per_page' => $roles->perPage(),
                ]
            ],
            'permissions' => Permission::all()->map(fn($p) => ['name' => $p->name]),
            'filters' => (object) $request->only(['search', 'per_page']),
        ]);
    }

    public function store(\App\Http\Requests\Dashboard\StoreRoleRequest $request)
    {
        $this->roleService->create($request->validated());

        return redirect()->back()->with('success', 'Rôle créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdateRoleRequest $request, $id)
    {
        $role = Role::findOrFail($id);
        $this->roleService->update($role, $request->validated());

        return redirect()->back()->with('success', 'Rôle mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        
        try {
            $this->roleService->delete($role);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->back()->with('success', 'Rôle supprimé avec succès.');
    }
}

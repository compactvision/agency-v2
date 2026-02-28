<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Administration
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $query = Role::query()->with('permissions');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $roles = $query->paginate($request->per_page ?? 20)->withQueryString();

        return Inertia::render('dashboard/roles/Roles', [
            'roles' => [
                'data' => collect($roles->items())->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->map(fn($p) => ['name' => $p->name]),
                ]),
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
        $validated = $request->validated();

        $role = Role::create(['name' => $validated['name']]);
        
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Rôle créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdateRoleRequest $request, $id)
    {
        $role = Role::findOrFail($id);
        $validated = $request->validated();

        $role->update(['name' => $validated['name']]);
        
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Rôle mis à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $role = Role::findOrFail($id);
        
        if (in_array($role->name, ['admin', 'super-admin'])) {
            return redirect()->back()->with('error', 'Impossible de supprimer un rôle système.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Rôle supprimé avec succès.');
    }
}

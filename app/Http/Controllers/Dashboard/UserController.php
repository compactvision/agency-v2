<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * User Management
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $query = User::query()->with('roles');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->filter) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->filter);
            });
        }

        $users = $query->paginate($request->per_page ?? 20)->withQueryString();

        return Inertia::render('dashboard/users/User', [
            'users' => [
                'data' => collect($users->items())->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_photo' => $user->profile_photo_path,
                    'roles' => $user->roles->map(fn($r) => ['name' => $r->name]),
                    'created_at' => $user->created_at->format('d/m/Y'),
                ]),
                'links' => $users->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ]
            ],
            'roles' => Role::all()->map(fn($r) => ['name' => $r->name]),
            'filters' => (object) $request->only(['search', 'filter', 'per_page']),
        ]);
    }

    public function store(\App\Http\Requests\Dashboard\StoreUserRequest $request)
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        if ($user->hasRole('super-admin') && !auth()->user()->hasRole('super-admin')) {
            return redirect()->back()->with('error', 'Seul un super-administrateur peut supprimer un autre super-administrateur.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }

    public function profile()
    {
        return Inertia::render('dashboard/profile/Profile', [
            'user' => auth()->user()
        ]);
    }
}

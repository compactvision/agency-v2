<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Domains\Auth\Services\UserService;
use App\Domains\Auth\Resources\UserResource;
class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * User Management
     */
    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $users = $this->userService->list($request->only(['search', 'filter', 'per_page']));

        return Inertia::render('dashboard/users/User', [
            'users' => [
                'data' => UserResource::collection($users->items())->resolve(),
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
        $this->userService->create($request->validated());

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $this->userService->update($user, $request->validated());

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        try {
            $this->userService->delete($user);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }

    public function profile()
    {
        return Inertia::render('dashboard/profile/Profile', [
            'user' => new UserResource(auth()->user()->load(['roles']))
        ]);
    }
}

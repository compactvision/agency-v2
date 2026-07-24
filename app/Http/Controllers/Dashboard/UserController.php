<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Auth\Resources\UserResource;
use App\Domains\Auth\Services\UserService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\StoreUserRequest;
use App\Http\Requests\Dashboard\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

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
        abort_unless($request->user()?->can('user.view'), 403);

        $users = $this->userService->list($request->only(['search', 'filter', 'per_page']));
        $roles = Role::query()
            ->when(
                ! $request->user()?->hasRole('super-admin'),
                fn ($query) => $query->where('name', '!=', 'super-admin'),
            )
            ->get();

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
                ],
            ],
            'roles' => $roles->map(fn ($r) => ['name' => $r->name]),
            'filters' => (object) $request->only(['search', 'filter', 'per_page']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->create($request->validated());

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $this->userService->update($user, $request->validated());

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy($id)
    {
        abort_unless(auth()->user()?->can('user.delete'), 403);

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
            'user' => new UserResource(auth()->user()->load(['roles'])),
        ]);
    }
}

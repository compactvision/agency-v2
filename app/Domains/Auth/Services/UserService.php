<?php

namespace App\Domains\Auth\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * List users with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = User::query()->with('roles');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['filter'])) {
            $query->whereHas('roles', function($q) use ($filters) {
                $q->where('name', $filters['filter']);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }

    /**
     * Update an existing user.
     */
    public function update(User $user, array $data): User
    {
        $user->update(collect($data)->only(['name', 'email'])->toArray());

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        return $user;
    }

    /**
     * Delete a user with safety checks.
     */
    public function delete(User $user): bool
    {
        if ($user->id === auth()->id()) {
            throw new \Exception('Vous ne pouvez pas supprimer votre propre compte.');
        }

        if ($user->hasRole('super-admin') && !auth()->user()->hasRole('super-admin')) {
            throw new \Exception('Seul un super-administrateur peut supprimer un autre super-administrateur.');
        }

        return $user->delete();
    }
}

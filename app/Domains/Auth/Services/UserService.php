<?php

namespace App\Domains\Auth\Services;

use App\Models\User;
use App\Support\AuditLogger;
use App\Support\UserAnonymizer;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private readonly AuditLogger $auditLogger,
        private readonly UserAnonymizer $userAnonymizer,
    ) {}

    /**
     * List users with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = User::query()
            ->whereNull('anonymized_at')
            ->with('roles');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['filter'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
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
        $requestedRoles = $data['roles'] ?? [];

        if (in_array('super-admin', $requestedRoles, true)
            && ! auth()->user()->hasRole('super-admin')) {
            throw new AuthorizationException('Only a super administrator may grant this role.');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if ($requestedRoles !== []) {
            $user->syncRoles($requestedRoles);
        }

        $this->auditLogger->record(
            'user.created',
            $user,
            "Compte utilisateur créé pour {$user->email}.",
            newValues: [
                ...$user->only(['name', 'email']),
                'roles' => $user->getRoleNames()->all(),
            ],
        );

        return $user;
    }

    /**
     * Update an existing user.
     */
    public function update(User $user, array $data): User
    {
        $actor = auth()->user();
        $requestedRoles = $data['roles'] ?? null;
        $before = $user->only(['name', 'email']);
        $before['roles'] = $user->getRoleNames()->all();

        if ($user->hasRole('super-admin') && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('Only a super administrator may edit a super administrator.');
        }

        if (is_array($requestedRoles)
            && in_array('super-admin', $requestedRoles, true)
            && ! $actor->hasRole('super-admin')) {
            throw new AuthorizationException('Only a super administrator may grant this role.');
        }

        if ($user->hasRole('super-admin')
            && is_array($requestedRoles)
            && ! in_array('super-admin', $requestedRoles, true)
            && User::role('super-admin')->count() <= 1) {
            throw new AuthorizationException('The last super administrator cannot lose that role.');
        }

        $user->update(collect($data)->only(['name', 'email'])->toArray());

        if (is_array($requestedRoles)) {
            $user->syncRoles($requestedRoles);
        }

        $user->refresh();
        $after = $user->only(['name', 'email']);
        $after['roles'] = $user->getRoleNames()->all();

        $this->auditLogger->record(
            'user.updated',
            $user,
            "Compte utilisateur {$user->email} mis à jour.",
            $before,
            $after,
            'warning',
        );

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

        if ($user->hasRole('super-admin') && ! auth()->user()->hasRole('super-admin')) {
            throw new \Exception('Seul un super-administrateur peut supprimer un autre super-administrateur.');
        }

        if ($user->hasRole('super-admin') && User::role('super-admin')->count() <= 1) {
            throw new \Exception('Le dernier super-administrateur ne peut pas être supprimé.');
        }

        $before = $user->only(['name']);
        $before['roles'] = $user->getRoleNames()->all();
        $userId = $user->id;
        $anonymized = $this->userAnonymizer->anonymize($user);

        if ($anonymized) {
            $this->auditLogger->record(
                'user.anonymized',
                $user,
                "Compte utilisateur {$userId} anonymisé et ses annonces archivées.",
                oldValues: $before,
                level: 'critical',
            );
        }

        return $anonymized;
    }
}

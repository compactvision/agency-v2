<?php

namespace App\Domains\Auth\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeSeller;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * REGISTER
     */
    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'phone' => $data['phone'] ?? null,
            'country_id' => $data['country_id'] ?? null,
            'city_id' => $data['city_id'] ?? null,
            'municipality_id' => $data['municipality_id'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        // Default role
        $user->assignRole('buyer');

        // Email verification link
        $user->sendEmailVerificationNotification();

        // Token for API
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user->load(['country', 'city', 'municipality', 'roles']),
            'token' => $token,
        ];
    }


    /**
     * LOGIN
     */
    public function login(array $credentials): array
    {
        if (
            !Auth::attempt([
                'email' => $credentials['email'],
                'password' => $credentials['password'],
            ])
        ) {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user->load(['country', 'city', 'municipality', 'roles']),
            'token' => $token,
        ];
    }


    /**
     * LOGOUT
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }


    /**
     * ME
     */
    public function me(User $user): User
    {
        return $user->load(['country', 'city', 'municipality', 'roles']);
    }


    /**
     * BECOME SELLER (avec dirty-check optimisé)
     */
    public function becomeSeller(User $user, array $data): User|string
    {
        $cleaned = array_map(fn($v) => $v === '' ? null : $v, $data);

        $user->fill([
            'name' => $cleaned['name'] ?? $user->name,
            'phone' => $cleaned['phone'],
            'bio' => $cleaned['bio'],
            'company' => $cleaned['company'],
            'rc_number' => $cleaned['rc_number'],
            'tax_number' => $cleaned['tax_number'],
            'user_type' => $cleaned['user_type'],
            'address' => $cleaned['address'] ?? $user->address,
            'country_id' => $cleaned['country_id'] ?? $user->country_id,
            'city_id' => $cleaned['city_id'] ?? $user->city_id,
            'municipality_id' => $cleaned['municipality_id'] ?? $user->municipality_id,
        ]);

        if (request()->hasFile('profile_photo')) {
            $path = request()->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo = $path;
        }

        // Determine correct role based on user_type
        $roleToAdd = ($cleaned['user_type'] === 'agency') ? 'agency' : 'seller';
        
        $roleChanged = !$user->hasRole($roleToAdd);

        // Aucun changement sur les champs + role déjà présent
        if (!$user->isDirty() && !$roleChanged) {
            return "NO_CHANGES";
        }

        // Sauver uniquement si dirty
        if ($user->isDirty()) {
            $user->save();
        }

        // Gérer les rôles si nécessaire
        if ($roleChanged) {
            // Supprimer explicitement le rôle 'buyer' s'il existe
            $user->removeRole('buyer');
            
            // Supprimer l'autre rôle de vendeur/agence pour éviter les doublons
            if ($roleToAdd === 'agency') {
                $user->removeRole('seller');
            } else {
                $user->removeRole('agency');
            }
            
            $user->assignRole($roleToAdd);
            
            // Envoyer le mail de bienvenue uniquement lors du premier passage ou changement de rôle majeur
            Mail::to($user->email)->send(new WelcomeSeller($user, $roleToAdd));
        }

        if (!$user->is_seller) {
            $user->is_seller = true;
            $user->save();
        }

        return $user->fresh()->load(['country', 'city', 'municipality', 'roles']);
    }



    /**
     * Update profile
     */
    public function updateProfile(User $user, array $data): User|string
    {
        // Nettoyage des champs vides → null
        $cleaned = array_map(fn($v) => $v === '' ? null : $v, $data);

        $user->fill($cleaned);

        // Rien n’a changé
        if (!$user->isDirty()) {
            return "NO_CHANGES";
        }

        // Sauvegarde uniquement si nécessaire
        $user->save();

        return $user->fresh()->load(['country', 'city', 'municipality', 'roles']);
    }



    /**
     * Change password
     */
    public function changePassword(User $user, array $data): void
    {
        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect']
            ]);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();
    }
}

<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    foreach (['admin', 'super-admin', 'buyer'] as $role) {
        Role::findOrCreate($role, 'web');
    }
});

test('an admin cannot grant the super administrator role', function () {
    $admin = User::factory()->create();
    $target = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->put(route('dashboard.users.update', $target->id), [
            'name' => $target->name,
            'email' => $target->email,
            'roles' => ['super-admin'],
        ])
        ->assertForbidden();

    expect($target->fresh()->hasRole('super-admin'))->toBeFalse();
});

test('an admin cannot edit a super administrator', function () {
    $admin = User::factory()->create();
    $superAdmin = User::factory()->create();
    $admin->assignRole('admin');
    $superAdmin->assignRole('super-admin');

    $this->actingAs($admin)
        ->put(route('dashboard.users.update', $superAdmin->id), [
            'name' => 'Compromised',
            'email' => $superAdmin->email,
            'roles' => ['buyer'],
        ])
        ->assertForbidden();

    expect($superAdmin->fresh()->name)->not->toBe('Compromised')
        ->and($superAdmin->fresh()->hasRole('super-admin'))->toBeTrue();
});

test('an admin cannot modify a privileged role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $adminRole = Role::findByName('admin');

    $this->actingAs($admin)
        ->put(route('dashboard.roles.update', $adminRole->id), [
            'name' => 'renamed-admin',
            'permissions' => [],
        ])
        ->assertForbidden();

    expect($adminRole->fresh()->name)->toBe('admin');
});

test('the last super administrator cannot remove their own privileged role', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $this->actingAs($superAdmin)
        ->put(route('dashboard.users.update', $superAdmin->id), [
            'name' => $superAdmin->name,
            'email' => $superAdmin->email,
            'roles' => ['buyer'],
        ])
        ->assertForbidden();

    expect($superAdmin->fresh()->hasRole('super-admin'))->toBeTrue();
});

<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

test('default roles receive the permissions defined for their responsibilities', function () {
    foreach (config('role_permissions.roles') as $roleName => $expectedPermissions) {
        $role = Role::findByName($roleName, 'web');
        $expected = $expectedPermissions === '*'
            ? config('role_permissions.permissions')
            : $expectedPermissions;

        expect($role->permissions->pluck('name')->sort()->values()->all())
            ->toBe(collect($expected)->sort()->values()->all());
    }
});

test('an administrator can see all permissions and create a custom role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get(route('dashboard.roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/roles/Roles')
            ->has('permissions', count(config('role_permissions.permissions')))
            ->where('roles.data.0.permissions', fn ($permissions) => $permissions->isNotEmpty())
        );

    $this->actingAs($admin)
        ->post(route('dashboard.roles.store'), [
            'name' => 'content-editor',
            'permissions' => ['property.view', 'pages.view', 'pages.update'],
        ])
        ->assertRedirect();

    $role = Role::findByName('content-editor', 'web');

    expect($role->getPermissionNames()->sort()->values()->all())->toBe([
        'pages.update',
        'pages.view',
        'property.view',
    ]);
});

test('a buyer cannot access or mutate role management', function () {
    $buyer = User::factory()->create();
    $buyer->assignRole('buyer');

    $this->actingAs($buyer)
        ->get(route('dashboard.roles.index'))
        ->assertForbidden();

    $this->actingAs($buyer)
        ->post(route('dashboard.roles.store'), [
            'name' => 'unauthorized-role',
            'permissions' => ['role.view'],
        ])
        ->assertForbidden();

    expect(Role::where('name', 'unauthorized-role')->exists())->toBeFalse();
});

test('an administrator cannot edit protected system roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $systemRole = Role::findByName('admin', 'web');

    $this->actingAs($admin)
        ->put(route('dashboard.roles.update', $systemRole), [
            'name' => 'renamed-admin',
            'permissions' => ['role.view'],
        ])
        ->assertForbidden();

    expect($systemRole->fresh()->name)->toBe('admin');
});

test('user management actions follow the permissions assigned to the administrator role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->post(route('dashboard.users.store'), [
            'name' => 'New Buyer',
            'email' => 'new-buyer@example.test',
            'password' => 'StrongPassword!42',
            'password_confirmation' => 'StrongPassword!42',
            'roles' => ['buyer'],
        ])
        ->assertRedirect();

    $newBuyer = User::where('email', 'new-buyer@example.test')->firstOrFail();

    expect($newBuyer->hasRole('buyer'))->toBeTrue();

    Role::findByName('admin', 'web')->revokePermissionTo('user.delete');

    $this->actingAs($admin)
        ->delete(route('dashboard.users.destroy', $newBuyer))
        ->assertForbidden();

    expect($newBuyer->fresh()->anonymized_at)->toBeNull();
});

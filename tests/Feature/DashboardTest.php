<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/Index')
            ->where('isBuyer', false)
        );
});

test('recent seller properties use their authorized dashboard detail route', function () {
    $dashboard = file_get_contents(
        resource_path('js/pages/dashboard/Index.tsx')
    );

    expect($dashboard)
        ->toContain("'dashboard.properties.show'")
        ->toContain("'property.show'")
        ->toContain('isBuyer');
});

test('authenticated users can visit the audit logs page', function () {
    Role::firstOrCreate(['name' => 'admin']);
    $user = User::factory()->create();
    $user->assignRole('admin');
    $this->actingAs($user);

    $this->get(route('dashboard.audit-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/auditLog/AuditLog')
            ->has('logs')
            ->has('logs.data')
        );
});

test('authenticated users can visit the transactions page', function () {
    Role::firstOrCreate(['name' => 'admin']);
    $user = User::factory()->create();
    $user->assignRole('admin');
    $this->actingAs($user);

    $this->get(route('dashboard.payment-requests.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/transactions/Transactions')
            ->has('paymentRequests')
            ->has('paymentRequests.data')
        );
});

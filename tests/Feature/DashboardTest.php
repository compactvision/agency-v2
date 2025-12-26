<?php
 
use App\Models\User;
 
test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.index'))->assertRedirect(route('login'));
});
 
test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());
 
    $this->get(route('dashboard.index'))->assertOk();
});

test('authenticated users can visit the audit logs page', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard.audit-logs.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/auditLog/AuditLog')
            ->has('logs')
            ->has('logs.data')
        );
});

test('authenticated users can visit the transactions page', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard.payment-requests.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/transactions/Transactions')
            ->has('paymentRequests')
            ->has('paymentRequests.data')
        );
});
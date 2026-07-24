<?php

use App\Models\AuditLog;
use App\Models\User;
use App\Support\AuditLogger;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('admin', 'web');
});

test('sensitive audit values are redacted', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    app(AuditLogger::class)->record(
        'security.test',
        $user,
        'Test de masquage.',
        newValues: [
            'email' => $user->email,
            'password' => 'not-allowed',
            'nested' => [
                'api_token' => 'not-allowed-either',
                'safe' => 'visible',
            ],
        ],
    );

    $log = AuditLog::firstOrFail();

    expect($log->new_values)->toMatchArray([
        'email' => $user->email,
        'password' => '[REDACTED]',
        'nested' => [
            'api_token' => '[REDACTED]',
            'safe' => 'visible',
        ],
    ]);
});

test('user administration operations create audit logs', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('admin');
    $target = User::factory()->create();

    $this->actingAs($admin)
        ->put(route('dashboard.users.update', $target), [
            'name' => 'Nom sécurisé',
            'email' => $target->email,
            'roles' => [],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('audit_logs', [
        'user_id' => $admin->id,
        'action' => 'user.updated',
        'entity_type' => 'User',
        'entity_id' => $target->id,
    ]);
});

test('only old audit logs are purged and the purge is itself recorded', function () {
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('admin');

    $old = AuditLog::create([
        'action' => 'old.entry',
        'description' => 'Ancien journal',
        'level' => 'info',
    ]);
    $old->timestamps = false;
    $old->forceFill([
        'created_at' => now()->subMonths(7),
        'updated_at' => now()->subMonths(7),
    ])->save();
    $recent = AuditLog::create([
        'action' => 'recent.entry',
        'description' => 'Journal récent',
        'level' => 'info',
    ]);

    $this->actingAs($admin)
        ->delete(route('dashboard.audit-logs.purge'))
        ->assertRedirect();

    expect(AuditLog::where('action', 'old.entry')->exists())->toBeFalse()
        ->and(AuditLog::whereKey($recent)->exists())->toBeTrue();

    $this->assertDatabaseHas('audit_logs', [
        'user_id' => $admin->id,
        'action' => 'audit_logs.purged',
        'level' => 'warning',
    ]);
});

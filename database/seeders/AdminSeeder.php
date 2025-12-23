<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@agency.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin12345'),
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');
    }
}

<?php

namespace Database\Seeders\Billing;

use Illuminate\Database\Seeder;
use App\Domains\Billing\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name'        => 'Free',
                'description' => 'Starter access with limited features.',
                'price'       => 0,
                'interval'    => 'monthly',
                'is_active'   => true,
                'position'    => 1,
            ],
            [
                'name'        => 'Pro',
                'description' => 'Ideal for regular users.',
                'price'       => 15,
                'interval'    => 'monthly',
                'is_active'   => true,
                'position'    => 2,
            ],
            [
                'name'        => 'Business',
                'description' => 'Full access for businesses.',
                'price'       => 30,
                'interval'    => 'monthly',
                'is_active'   => true,
                'position'    => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['name' => $plan['name']],
                $plan
            );
        }
    }
}

<?php

namespace Database\Seeders\Billing;

use Illuminate\Database\Seeder;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PlanSeeder::class,
            PlanFeatureSeeder::class,
        ]);
    }
}

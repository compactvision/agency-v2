<?php

namespace Database\Seeders\Billing;

use Illuminate\Database\Seeder;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Models\PlanFeature;

class PlanFeatureSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            'Free' => [
                ['name' => 'Listings per month', 'value' => '3'],
                ['name' => 'Images per ad', 'value' => '3'],
                ['name' => 'Support', 'value' => 'Email only'],
                ['name' => 'Analytics', 'value' => 'Basic'],
            ],

            'Pro' => [
                ['name' => 'Listings per month', 'value' => '20'],
                ['name' => 'Images per ad', 'value' => '10'],
                ['name' => 'Support', 'value' => 'Priority Email'],
                ['name' => 'Analytics', 'value' => 'Advanced'],
                ['name' => 'Team members', 'value' => '3'],
            ],

            'Business' => [
                ['name' => 'Listings per month', 'value' => 'Unlimited'],
                ['name' => 'Images per ad', 'value' => 'Unlimited'],
                ['name' => 'Support', 'value' => '24/7 Support'],
                ['name' => 'Analytics', 'value' => 'Full Dashboard'],
                ['name' => 'Team members', 'value' => 'Unlimited'],
                ['name' => 'Custom branding', 'value' => 'Enabled'],
            ],
        ];

        foreach ($features as $planName => $list) {
            $plan = Plan::where('name', $planName)->first();
            if (!$plan)
                continue;

            foreach ($list as $feature) {
                PlanFeature::updateOrCreate(
                    [
                        'plan_id' => $plan->id,
                        'name' => $feature['name'],
                    ],
                    [
                        'value' => $feature['value'],
                    ]
                );
            }
        }
    }
}

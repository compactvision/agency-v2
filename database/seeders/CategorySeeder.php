<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Categories\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Maison',
                'is_active' => true,
                'position' => 1,
            ],
            [
                'name' => 'Appartement',
                'is_active' => true,
                'position' => 2,
            ],
            [
                'name' => 'Terrain',
                'is_active' => true,
                'position' => 3,
            ],
            [
                'name' => 'Immeuble',
                'is_active' => true,
                'position' => 4,
            ],
            [
                'name' => 'Bureau',
                'is_active' => true,
                'position' => 5,
            ],
            [
                'name' => 'Entrepôt',
                'is_active' => true,
                'position' => 6,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'slug' => Str::slug($cat['name']),
                    'is_active' => $cat['is_active'],
                    'position' => $cat['position'],
                ]
            );
        }
    }
}

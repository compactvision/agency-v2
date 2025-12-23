<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains\Amenities\Models\Amenity;
use Illuminate\Support\Str;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            'Piscine',
            'Piscine Privée',
            'Garage',
            'Parking',
            'Jardin',
            'Balcon',
            'Terrasse',
            'Climatisation',
            'Ascenseur',
            'Sécurité 24/7',
            'Eau courante',
            'Électricité',
            'Internet',
            'Meublé',
        ];

        foreach ($amenities as $index => $name) {
            Amenity::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'is_active' => true,
                    'position' => $index + 1,
                ]
            );
        }
    }
}

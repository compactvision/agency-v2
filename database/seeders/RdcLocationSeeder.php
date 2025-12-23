<?php

namespace Database\Seeders;

use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RdcLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1) Country ---
        $country = Country::create([
            'name' => 'République Démocratique du Congo',
            'iso_code' => 'CD',
        ]);

        // --- 2) Cities ---
        $kinshasa = City::create([
            'name' => 'Kinshasa',
            'country_id' => $country->id,
        ]);

        $lubumbashi = City::create([
            'name' => 'Lubumbashi',
            'country_id' => $country->id,
        ]);


        // --- 3) Municipalities of Kinshasa ---
        $municipalities = [
            'Gombe',
            'Kinshasa',
            'Kasa-Vubu',
            'Bandalungwa',
            'Lingwala',
            'Barumbu',
            'Ngaliema',
            'Mont Ngafula',
            'Masina',
            'Kimbanseke',
            'Matete',
            'Lemba',
            'Ngaba',
            'Makala',
            'Selembao',
            'Bumbu',
            'Ngiri-Ngiri',
            'Kalimani',
            'N’sele',
            'Maluku',
            'Kisenso',
            'Limete',
            'Ndjili',
            'Bandalungwa'
        ];

        foreach ($municipalities as $name) {
            Municipality::create([
                'name' => $name,
                'city_id' => $kinshasa->id,
            ]);
        }
    }
}

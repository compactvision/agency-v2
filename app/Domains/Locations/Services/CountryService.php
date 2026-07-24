<?php

namespace App\Domains\Locations\Services;

use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Resources\CountryResource;
use App\Support\ReferenceCache;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CountryService
{
    public function all()
    {
        $countries = ReferenceCache::remember(
            ReferenceCache::COUNTRIES,
            fn () => Country::orderBy('name')->get(),
        );

        return CountryResource::collection($countries);
    }

    public function find(int $id)
    {
        $country = Country::find($id);

        if (! $country) {
            throw new ModelNotFoundException('Country not found');
        }

        return new CountryResource($country);
    }

    public function create(array $data)
    {
        $country = Country::create($data);

        return new CountryResource($country);
    }

    public function update(int $id, array $data)
    {
        $country = Country::find($id);

        if (! $country) {
            throw new ModelNotFoundException('Country not found');
        }

        $changes = [];

        foreach ($data as $field => $value) {
            if ($value !== $country->$field) {
                $changes[$field] = $value;
            }
        }

        if (empty($changes)) {
            return [
                'no_changes' => true,
                'changed_fields' => [],
                'country' => new CountryResource($country),
            ];
        }

        if (isset($changes['iso_code'])) {
            $exists = Country::where('iso_code', $changes['iso_code'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                throw new \Exception('ISO code already exists');
            }
        }

        $country->update($changes);

        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'country' => new CountryResource($country),
        ];
    }

    public function delete(int $id): bool
    {
        $country = Country::find($id);

        if (! $country) {
            throw new ModelNotFoundException('Country not found');
        }

        return $country->delete();
    }
}

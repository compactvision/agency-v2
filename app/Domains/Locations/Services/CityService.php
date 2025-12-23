<?php

namespace App\Domains\Locations\Services;

use App\Domains\Locations\Models\City;
use App\Domains\Locations\Resources\CityResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CityService
{
    public function all()
    {
        return CityResource::collection(
            City::with('country')->orderBy('name')->get()
        );
    }

    public function find(int $id)
    {
        $city = City::with('country')->find($id);

        if (!$city) {
            throw new ModelNotFoundException("City not found");
        }

        return new CityResource($city);
    }

    public function create(array $data)
    {
        $city = City::create($data);
        $city->load('country');

        return new CityResource($city);
    }

    public function update(int $id, array $data)
    {
        $city = City::find($id);

        if (!$city) {
            throw new ModelNotFoundException("City not found");
        }

        $changes = [];

        foreach ($data as $field => $value) {
            if ($city->$field !== $value) {
                $changes[$field] = $value;
            }
        }

        if (empty($changes)) {
            return [
                'no_changes' => true,
                'changed_fields' => [],
                'city' => new CityResource($city),
            ];
        }

        $city->update($changes);
        $city->load('country');

        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'city' => new CityResource($city),
        ];
    }

    public function delete(int $id): bool
    {
        $city = City::find($id);

        if (!$city) {
            throw new ModelNotFoundException("City not found");
        }

        return $city->delete();
    }
}

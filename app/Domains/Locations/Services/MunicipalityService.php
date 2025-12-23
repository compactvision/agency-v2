<?php

namespace App\Domains\Locations\Services;

use App\Domains\Locations\Models\Municipality;
use App\Domains\Locations\Resources\MunicipalityResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MunicipalityService
{
    public function all()
    {
        return MunicipalityResource::collection(
            Municipality::with(['city.country'])
                ->orderBy('name')
                ->get()
        );
    }

    public function find(int $id)
    {
        $municipality = Municipality::with(['city.country'])->find($id);

        if (!$municipality) {
            throw new ModelNotFoundException("Municipality not found");
        }

        return new MunicipalityResource($municipality);
    }

    public function create(array $data)
    {
        $municipality = Municipality::create($data);
        $municipality->load(['city.country']);

        return new MunicipalityResource($municipality);
    }

    public function update(int $id, array $data)
    {
        $municipality = Municipality::find($id);

        if (!$municipality) {
            throw new ModelNotFoundException("Municipality not found");
        }

        $changes = [];

        foreach ($data as $field => $value) {
            if ($municipality->$field !== $value) {
                $changes[$field] = $value;
            }
        }

        if (empty($changes)) {
            return [
                'no_changes' => true,
                'changed_fields' => [],
                'municipality' => new MunicipalityResource($municipality),
            ];
        }

        $municipality->update($changes);
        $municipality->load(['city.country']);

        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'municipality' => new MunicipalityResource($municipality),
        ];
    }

    public function delete(int $id): bool
    {
        $municipality = Municipality::find($id);

        if (!$municipality) {
            throw new ModelNotFoundException("Municipality not found");
        }

        return $municipality->delete();
    }
}

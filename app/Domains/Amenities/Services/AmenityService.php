<?php

namespace App\Domains\Amenities\Services;

use App\Domains\Amenities\Models\Amenity;
use App\Domains\Amenities\Resources\AmenityResource;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AmenityService
{
    public function all()
    {
        return AmenityResource::collection(
            Amenity::orderBy('position')->orderBy('name')->get()
        );
    }

    public function find(int $id)
    {
        $amenity = Amenity::find($id);

        if (!$amenity) {
            throw new ModelNotFoundException();
        }

        return new AmenityResource($amenity);
    }

    public function create(array $data)
    {
        $data['slug'] = Str::slug($data['name']);

        $amenity = Amenity::create($data);

        return new AmenityResource($amenity);
    }

    public function update(int $id, array $data): array
    {
        $amenity = Amenity::findOrFail($id);

        // Normaliser les champs (évite NULL vs 0 ou "" vs null)
        foreach ($data as $key => $value) {
            if ($value === "") {
                $data[$key] = null;
            }
        }

        // Si le name change → regenerer le slug
        if (isset($data['name']) && $data['name'] !== $amenity->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Détection manuelle des changements
        $changes = [];
        foreach ($data as $field => $value) {
            if ($amenity->$field != $value) {   // comparaison non-stricte pour éviter NULL vs "0"
                $changes[$field] = $value;
            }
        }

        // Aucun changement
        if (empty($changes)) {
            return [
                'no_changes' => true,
                'amenity' => new AmenityResource($amenity->fresh())
            ];
        }

        // Mise à jour ciblée
        $amenity->update($changes);

        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'amenity' => new AmenityResource($amenity->fresh())
        ];
    }


    public function delete(int $id)
    {
        $amenity = Amenity::find($id);

        if (!$amenity) {
            throw new ModelNotFoundException();
        }

        return $amenity->delete();
    }
}

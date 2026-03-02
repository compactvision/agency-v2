<?php

namespace App\Domains\Locations\Services;

use App\Domains\Locations\Models\Municipality;
use App\Domains\Locations\Resources\MunicipalityResource;

class MunicipalityService
{
    /**
     * List municipalities with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 10)
    {
        $query = Municipality::query()
            ->with(['city'])
            ->withCount('properties');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get all municipalities.
     */
    public function all()
    {
        return MunicipalityResource::collection(
            Municipality::with(['city'])->get()
        );
    }

    /**
     * Find a municipality by ID.
     */
    public function find($id)
    {
        return new MunicipalityResource(
            Municipality::with(['city'])->findOrFail($id)
        );
    }

    /**
     * Create a new municipality.
     */
    public function create(array $data)
    {
        $municipality = Municipality::create($data);
        $municipality->load('city');
        return new MunicipalityResource($municipality);
    }

    /**
     * Update an existing municipality.
     */
    public function update($id, array $data)
    {
        $municipality = Municipality::findOrFail($id);
        
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
        $municipality->load('city');
        
        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'municipality' => new MunicipalityResource($municipality),
        ];
    }

    /**
     * Delete a municipality.
     */
    public function delete($id)
    {
        $municipality = Municipality::findOrFail($id);
        return $municipality->delete();
    }
}

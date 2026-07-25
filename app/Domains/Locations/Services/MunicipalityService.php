<?php

namespace App\Domains\Locations\Services;

use App\Domains\Locations\Models\Municipality;
use App\Domains\Locations\Resources\MunicipalityResource;
use App\Support\ReferenceCache;

class MunicipalityService
{
    /**
     * List municipalities with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 10)
    {
        $query = Municipality::query()
            ->with(['city.country'])
            ->withCount(['properties' => function ($query) {
                $query->where('is_published', true)
                    ->where('is_approved', true);
            }]);

        if (! empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Get all municipalities.
     */
    public function all()
    {
        $municipalities = ReferenceCache::remember(
            ReferenceCache::MUNICIPALITIES,
            fn () => Municipality::with(['city.country'])
                ->withCount(['properties' => function ($query) {
                    $query->where('is_published', true)
                        ->where('is_approved', true);
                }])
                ->get(),
        );

        return MunicipalityResource::collection($municipalities);
    }

    /**
     * Find a municipality by ID.
     */
    public function find($id)
    {
        return new MunicipalityResource(
            Municipality::with(['city.country'])->findOrFail($id)
        );
    }

    /**
     * Create a new municipality.
     */
    public function create(array $data)
    {
        $municipality = Municipality::create($data);
        $municipality->load('city.country');

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
            if ($value !== $municipality->$field) {
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
        $municipality->load('city.country');

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

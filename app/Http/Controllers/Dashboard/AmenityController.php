<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Amenities\Resources\AmenityResource;
use App\Domains\Amenities\Services\AmenityService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AmenityController extends Controller
{
    public function __construct(protected AmenityService $service) {}

    public function index(Request $request)
    {
        $amenities = $this->service->all();

        return Inertia::render('dashboard/amenities/Index', [
            'amenities' => AmenityResource::collection($amenities)->resolve(),
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:amenities,name',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $this->service->create($validated);

        return back()->with('success', 'Équipement créé avec succès.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:amenities,name,'.$id,
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $this->service->update($id, $validated);

        return back()->with('success', 'Équipement mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return back()->with('success', 'Équipement supprimé avec succès.');
    }
}

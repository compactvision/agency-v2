<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Locations\Resources\MunicipalityResource;
use App\Domains\Locations\Services\MunicipalityService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MunicipalityController extends Controller
{
    protected $municipalityService;

    public function __construct(MunicipalityService $municipalityService)
    {
        $this->municipalityService = $municipalityService;
    }

    public function index(Request $request)
    {
        $municipalities = $this->municipalityService->list($request->only(['search']));

        return Inertia::render('dashboard/municipalities/Municipalities', [
            'municipalities' => [
                'data' => MunicipalityResource::collection($municipalities->items())->resolve(),
                'meta' => [
                    'current_page' => $municipalities->currentPage(),
                    'last_page' => $municipalities->lastPage(),
                    'total' => $municipalities->total(),
                    'from' => $municipalities->firstItem(),
                    'to' => $municipalities->lastItem(),
                ],
                'links' => $municipalities->linkCollection()->toArray(),
            ],
            'cities' => \App\Domains\Locations\Models\City::all()->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
        ]);

        $this->municipalityService->create($validated);

        return back()->with('success', 'Commune créée avec succès.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
        ]);

        $this->municipalityService->update($id, $validated);

        return back()->with('success', 'Commune mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $this->municipalityService->delete($id);

        return back()->with('success', 'Commune supprimée avec succès.');
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use App\Domains\Locations\Resources\MunicipalityResource;
use App\Domains\Locations\Services\MunicipalityService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'countries' => Country::query()
                ->orderBy('name')
                ->get(['id', 'name', 'iso_code']),
            'cities' => City::query()
                ->orderBy('name')
                ->get(['id', 'country_id', 'name']),
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('municipalities', 'public');
        }

        $this->municipalityService->create($validated);

        return back()->with('success', 'Commune créée avec succès.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city_id' => 'required|exists:cities,id',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ]);

        $municipality = Municipality::findOrFail($id);
        $oldImage = $municipality->image;
        $removeImage = $request->boolean('remove_image');

        unset($validated['remove_image']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('municipalities', 'public');
        } elseif ($removeImage) {
            $validated['image'] = null;
        } else {
            unset($validated['image']);
        }

        $this->municipalityService->update($id, $validated);

        if (($request->hasFile('image') || $removeImage) && $oldImage) {
            Storage::disk('public')->delete($oldImage);
        }

        return back()->with('success', 'Commune mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $municipality = Municipality::findOrFail($id);
        $image = $municipality->image;

        $this->municipalityService->delete($id);

        if ($image) {
            Storage::disk('public')->delete($image);
        }

        return back()->with('success', 'Commune supprimée avec succès.');
    }
}

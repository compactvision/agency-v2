<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Locations\Models\Municipality;

class MunicipalityController extends Controller
{
    public function index(Request $request)
    {
        $query = Municipality::query()
            ->with(['city'])
            ->withCount('properties');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $municipalities = $query->paginate(10);

        return Inertia::render('dashboard/municipalities/Municipalities', [
            'municipalities' => [
                'data' => collect($municipalities->items())->map(function($m) {
                    return [
                        'id' => $m->id,
                        'name' => $m->name,
                        'country' => 'Congo-Kinshasa',
                        'city' => $m->city?->name ?? 'Kinshasa',
                        'properties_count' => $m->properties_count,
                    ];
                }),
                'meta' => [
                    'current_page' => $municipalities->currentPage(),
                    'last_page'    => $municipalities->lastPage(),
                    'total'        => $municipalities->total(),
                    'from'         => $municipalities->firstItem(),
                    'to'           => $municipalities->lastItem(),
                ],
                'links' => $municipalities->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Locations\Models\Municipality;
use App\Domains\Locations\Services\MunicipalityService;
use App\Domains\Locations\Resources\MunicipalityResource;

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

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Services\PlanService;
use App\Domains\Billing\Resources\PlanResource;
class PlanController extends Controller
{
    protected $planService;

    public function __construct(PlanService $planService)
    {
        $this->planService = $planService;
    }

    public function index(Request $request)
    {
        $plans = $this->planService->list($request->only(['search']));

        return Inertia::render('dashboard/plans/Tarifs', [
            'plans' => [
                'data' => PlanResource::collection($plans->items())->resolve(),
                'meta' => [
                    'current_page' => $plans->currentPage(),
                    'last_page'    => $plans->lastPage(),
                    'total'        => $plans->total(),
                    'from'         => $plans->firstItem(),
                    'to'           => $plans->lastItem(),
                ],
                'links' => $plans->linkCollection()->toArray(),
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(\App\Http\Requests\Dashboard\StorePlanRequest $request)
    {
        $this->planService->create($request->validated());

        return redirect()->back()->with('success', 'Plan créé avec succès.');
    }

    public function update(\App\Http\Requests\Dashboard\UpdatePlanRequest $request, $id)
    {
        $plan = Plan::findOrFail($id);
        $this->planService->update($plan, $request->validated());

        return redirect()->back()->with('success', 'Plan mis à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $plan = Plan::findOrFail($id);
        $this->planService->delete($plan);

        return redirect()->back()->with('success', 'Plan supprimé avec succès.');
    }
}

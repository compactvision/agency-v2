<?php

namespace App\Domains\Billing\Controllers;

use App\Domains\Billing\Models\Plan;
use App\Domains\Billing\Requests\StorePlanRequest;
use App\Domains\Billing\Requests\UpdatePlanRequest;
use App\Domains\Billing\Resources\PlanResource;
use App\Support\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PlanController
{
    public function index()
    {
        $plans = Plan::with('features')->orderBy('position')->get();

        return ApiResponse::success(
            PlanResource::collection($plans),
            'Plans retrieved successfully'
        );
    }

    public function store(StorePlanRequest $request)
    {
        try {
            $plan = Plan::create($request->validated());

            return ApiResponse::success(
                new PlanResource($plan),
                'Plan created successfully',
                201
            );
        } catch (\Throwable $e) {
            if (app()->isLocal()) {
                return ApiResponse::error($e->getMessage(), 500);
            }

            return ApiResponse::error('Internal server error', 500);
        }
    }

    public function show(int $id)
    {
        try {
            $plan = Plan::with('features')->findOrFail($id);

            return ApiResponse::success(
                new PlanResource($plan),
                'Plan retrieved successfully'
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Plan not found', 404);
        }
    }

    public function update(UpdatePlanRequest $request, int $id)
    {
        try {
            $plan = Plan::findOrFail($id);

            $data = $request->validated();
            $changes = [];

            foreach ($data as $field => $value) {
                if ($plan->$field !== $value) {
                    $changes[$field] = $value;
                }
            }

            if (empty($changes)) {
                return ApiResponse::success([
                    'no_changes'     => true,
                    'changed_fields' => [],
                    'plan'           => new PlanResource($plan),
                ], 'No changes detected');
            }

            $plan->update($changes);

            return ApiResponse::success([
                'no_changes'     => false,
                'changed_fields' => $changes,
                'plan'           => new PlanResource($plan->fresh('features')),
            ], 'Plan updated successfully');
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Plan not found', 404);
        } catch (\Throwable $e) {
            if (app()->isLocal()) {
                return ApiResponse::error($e->getMessage(), 500);
            }

            return ApiResponse::error('Internal server error', 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $plan = Plan::findOrFail($id);
            $plan->delete();

            return ApiResponse::success(null, 'Plan deleted successfully');
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Plan not found', 404);
        } catch (\Throwable $e) {
            if (app()->isLocal()) {
                return ApiResponse::error($e->getMessage(), 500);
            }

            return ApiResponse::error('Internal server error', 500);
        }
    }
}

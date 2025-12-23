<?php

namespace App\Domains\Locations\Controllers;

use App\Support\ApiResponse;
use App\Domains\Locations\Services\MunicipalityService;
use App\Domains\Locations\Requests\StoreMunicipalityRequest;
use App\Domains\Locations\Requests\UpdateMunicipalityRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MunicipalityController
{
    public function __construct(
        protected MunicipalityService $service
    ) {}

    public function index()
    {
        return ApiResponse::success(
            $this->service->all(),
            "Municipalities retrieved successfully"
        );
    }

    public function store(StoreMunicipalityRequest $request)
    {
        try {
            return ApiResponse::success(
                $this->service->create($request->validated()),
                "Municipality created successfully",
                201
            );
        } catch (\Throwable $e) {
            return ApiResponse::error("Internal server error", 500);
        }
    }

    public function show($id)
    {
        try {
            return ApiResponse::success(
                $this->service->find($id)
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Municipality not found", 404);
        }
    }

    public function update(UpdateMunicipalityRequest $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());

            if ($result['no_changes']) {
                return ApiResponse::success($result, "No changes detected");
            }

            return ApiResponse::success($result, "Municipality updated successfully");

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Municipality not found", 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, "Municipality deleted successfully");

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Municipality not found", 404);
        }
    }
}

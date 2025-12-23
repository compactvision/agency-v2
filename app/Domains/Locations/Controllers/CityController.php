<?php

namespace App\Domains\Locations\Controllers;

use App\Support\ApiResponse;
use App\Domains\Locations\Services\CityService;
use App\Domains\Locations\Requests\StoreCityRequest;
use App\Domains\Locations\Requests\UpdateCityRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CityController
{
    public function __construct(
        protected CityService $service
    ) {}

    public function index()
    {
        return ApiResponse::success(
            $this->service->all(),
            "Cities retrieved successfully"
        );
    }

    public function store(StoreCityRequest $request)
    {
        try {
            return ApiResponse::success(
                $this->service->create($request->validated()),
                "City created successfully",
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
            return ApiResponse::error("City not found", 404);
        }
    }

    public function update(UpdateCityRequest $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());

            if ($result['no_changes']) {
                return ApiResponse::success($result, "No changes detected");
            }

            return ApiResponse::success($result, "City updated successfully");

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("City not found", 404);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);

            return ApiResponse::success(null, "City deleted successfully");

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("City not found", 404);
        }
    }
}

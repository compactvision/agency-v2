<?php

namespace App\Domains\Amenities\Controllers;

use App\Support\ApiResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Domains\Amenities\Services\AmenityService;
use App\Domains\Amenities\Requests\StoreAmenityRequest;
use App\Domains\Amenities\Requests\UpdateAmenityRequest;

class AmenityController
{
    public function __construct(protected AmenityService $service) {}

    public function index()
    {
        return ApiResponse::success(
            $this->service->all(),
            "Amenities retrieved successfully"
        );
    }

    public function store(StoreAmenityRequest $request)
    {
        return ApiResponse::success(
            $this->service->create($request->validated()),
            "Amenity created",
            201
        );
    }

    public function show(int $id)
    {
        try {
            return ApiResponse::success(
                $this->service->find($id),
            );
        } catch (ModelNotFoundException) {
            return ApiResponse::error("Amenity not found", 404);
        }
    }

    public function update(UpdateAmenityRequest $request, int $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());

            if ($result['no_changes']) {
                return ApiResponse::success($result['amenity'], "No changes detected");
            }

            return ApiResponse::success($result['amenity'], "Amenity updated");

        } catch (ModelNotFoundException) {
            return ApiResponse::error("Amenity not found", 404);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, "Amenity deleted");

        } catch (ModelNotFoundException) {
            return ApiResponse::error("Amenity not found", 404);
        }
    }
}

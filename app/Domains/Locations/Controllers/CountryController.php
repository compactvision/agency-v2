<?php

namespace App\Domains\Locations\Controllers;

use App\Support\ApiResponse;
use App\Domains\Locations\Services\CountryService;
use App\Domains\Locations\Requests\StoreCountryRequest;
use App\Domains\Locations\Requests\UpdateCountryRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CountryController
{
    public function __construct(
        protected CountryService $service
    ) {}

    public function index()
    {
        return ApiResponse::success(
            $this->service->all(),
            "Countries retrieved successfully"
        );
    }

    public function store(StoreCountryRequest $request)
    {
        try {
            return ApiResponse::success(
                $this->service->create($request->validated()),
                "Country created successfully",
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
                $this->service->find($id),
                "Country retrieved successfully"
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Country not found", 404);
        }
    }

    public function update(UpdateCountryRequest $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());

            if ($result['no_changes']) {
                return ApiResponse::success($result, "No changes detected");
            }

            return ApiResponse::success($result, "Country updated successfully");

        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Country not found", 404);

        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 422);

        } catch (\Throwable $e) {
            return ApiResponse::error("Internal server error", 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, "Country deleted successfully");
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Country not found", 404);
        }
    }
}

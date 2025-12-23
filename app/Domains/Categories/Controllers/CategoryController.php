<?php

namespace App\Domains\Categories\Controllers;

use App\Support\ApiResponse;
use App\Domains\Categories\Services\CategoryService;
use App\Domains\Categories\Requests\StoreCategoryRequest;
use App\Domains\Categories\Requests\UpdateCategoryRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController
{
    public function __construct(protected CategoryService $service) {}

    public function index()
    {
        return ApiResponse::success($this->service->all(), "Categories retrieved successfully");
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = $this->service->create($request->validated());
            return ApiResponse::success($category, "Category created", 201);
        } catch (\Throwable $e) {
            if (app()->isLocal()) throw $e;
            return ApiResponse::error("Internal server error", 500);
        }
    }

    public function show($id)
    {
        try {
            return ApiResponse::success($this->service->find($id));
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Category not found", 404);
        }
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->validated());
            if ($result['no_changes']) {
                return ApiResponse::success($result['category'], "No changes detected");
            }
            return ApiResponse::success($result['category'], "Category updated");
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Category not found", 404);
        } catch (\Throwable $e) {
            if (app()->isLocal()) throw $e;
            return ApiResponse::error("Internal server error", 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return ApiResponse::success(null, "Category deleted");
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error("Category not found", 404);
        } catch (\Throwable $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }
}

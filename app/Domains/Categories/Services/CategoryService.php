<?php

namespace App\Domains\Categories\Services;

use App\Domains\Categories\Models\Category;
use App\Domains\Categories\Resources\CategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;

class CategoryService
{
    public function all()
    {
        return CategoryResource::collection(Category::orderBy('position')->orderBy('name')->get());
    }

    public function find(int $id)
    {
        $category = Category::find($id);

        if (!$category) {
            throw new ModelNotFoundException("Category not found");
        }

        return new CategoryResource($category);
    }

    public function create(array $data)
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category = Category::create($data);
        return new CategoryResource($category);
    }

    public function update(int $id, array $data)
    {
        $category = Category::find($id);
        if (!$category) {
            throw new ModelNotFoundException("Category not found");
        }

        // detect changes
        $changes = [];
        foreach ($data as $k => $v) {
            if ($v !== null && $category->$k !== $v) {
                $changes[$k] = $v;
            }
        }

        if (empty($changes)) {
            return [
                'no_changes' => true,
                'category' => new CategoryResource($category),
            ];
        }

        if (isset($changes['name']) && empty($changes['slug'])) {
            $changes['slug'] = Str::slug($changes['name']);
        }

        $category->update($changes);

        return [
            'no_changes' => false,
            'changed_fields' => $changes,
            'category' => new CategoryResource($category),
        ];
    }

    public function delete(int $id): bool
    {
        $category = Category::find($id);
        if (!$category) {
            throw new ModelNotFoundException("Category not found");
        }

        // Optional: prevent deletion if ads exist
        if ($category->ads()->exists()) {
            throw new \Exception("Cannot delete category with existing ads");
        }

        return $category->delete();
    }
}

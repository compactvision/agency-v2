<?php

namespace App\Http\Controllers\Dashboard;

use App\Domains\Categories\Resources\CategoryResource;
use App\Domains\Categories\Services\CategoryService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $service) {}

    public function index(Request $request)
    {
        $categories = $this->service->all(); // Or paginate if service supports it

        return Inertia::render('dashboard/categories/Index', [
            'categories' => CategoryResource::collection($categories)->resolve(),
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $this->service->create($validated);

        return back()->with('success', 'Catégorie créée avec succès.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$id,
            'slug' => 'nullable|string|max:255|unique:categories,slug,'.$id,
            'icon' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $this->service->update($id, $validated);

        return back()->with('success', 'Catégorie mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $this->service->delete($id);

        return back()->with('success', 'Catégorie supprimée avec succès.');
    }
}

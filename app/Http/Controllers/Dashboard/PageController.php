<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\CMS\Models\Page;
use App\Domains\CMS\Models\PageSection;

class PageController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $query = Page::query()->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%");
        }

        $pages = $query->paginate(20)->withQueryString();

        return Inertia::render('dashboard/pages/Pages', [
            'pages' => [
                'data' => $pages->items(),
                'links' => $pages->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page' => $pages->lastPage(),
                    'total' => $pages->total(),
                    'per_page' => $pages->perPage(),
                ]
            ],
            'filters' => (object) $request->only(['search']),
        ]);
    }

    public function create()
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        return Inertia::render('dashboard/pages/PageEditor');
    }

    public function store(\App\Http\Requests\Dashboard\StorePageRequest $request)
    {
        $validated = $request->validated();

        $page = Page::create([
            'title' => $validated['title'],
            'status' => 'published', // Default to published for now
        ]);

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $index => $section) {
                $page->sections()->create([
                    'heading' => $section['heading'],
                    'paragraph' => $section['paragraph'],
                    'position' => $index,
                ]);
            }
        }

        return redirect()->route('dashboard.pages.index')
            ->with('success', 'Page créée avec succès.');
    }

    public function edit($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $page = Page::with('sections')->findOrFail($id);

        return Inertia::render('dashboard/pages/PageEditor', [
            'page' => $page
        ]);
    }

    public function update(\App\Http\Requests\Dashboard\UpdatePageRequest $request, $id)
    {
        $page = Page::findOrFail($id);
        $validated = $request->validated();

        $page->update([
            'title' => $validated['title'],
        ]);

        // Simple sync: delete old sections and re-create
        $page->sections()->delete();

        if (!empty($validated['sections'])) {
            foreach ($validated['sections'] as $index => $section) {
                $page->sections()->create([
                    'heading' => $section['heading'],
                    'paragraph' => $section['paragraph'],
                    'position' => $index,
                ]);
            }
        }

        return redirect()->route('dashboard.pages.index')
            ->with('success', 'Page mise à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $page = Page::findOrFail($id);
        $page->delete();

        return redirect()->route('dashboard.pages.index')
            ->with('success', 'Page supprimée avec succès.');
    }
}

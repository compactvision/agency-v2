<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Domains\CMS\Models\Page;
use App\Domains\CMS\Models\PageSection;
use App\Domains\CMS\Services\PageService;
use App\Domains\CMS\Resources\PageResource;

class PageController extends Controller
{
    protected $pageService;

    public function __construct(PageService $pageService)
    {
        $this->pageService = $pageService;
    }

    public function index(Request $request)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $pages = $this->pageService->list($request->only(['search']));

        return Inertia::render('dashboard/pages/Pages', [
            'pages' => [
                'data' => PageResource::collection($pages->items())->resolve(),
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
        $this->pageService->create($request->validated());

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
            'page' => new PageResource($page)
        ]);
    }

    public function update(\App\Http\Requests\Dashboard\UpdatePageRequest $request, $id)
    {
        $page = Page::findOrFail($id);
        $this->pageService->update($page, $request->validated());

        return redirect()->route('dashboard.pages.index')
            ->with('success', 'Page mise à jour avec succès.');
    }

    public function destroy($id)
    {
        if (!auth()->user()->hasRole(['admin', 'super-admin'])) {
            abort(403);
        }

        $page = Page::findOrFail($id);
        $this->pageService->delete($page);

        return redirect()->route('dashboard.pages.index')
            ->with('success', 'Page supprimée avec succès.');
    }
}

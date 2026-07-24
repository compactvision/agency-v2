<?php

namespace App\Domains\CMS\Services;

use App\Domains\CMS\Models\Page;
use Illuminate\Support\Facades\DB;

class PageService
{
    /**
     * List pages with filters and pagination.
     */
    public function list(array $filters = [], int $perPage = 20)
    {
        $query = Page::query()->orderBy('created_at', 'desc');

        if (! empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%")
                ->orWhere('slug', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new page.
     */
    public function create(array $data): Page
    {
        return DB::transaction(function () use ($data) {
            $page = Page::create([
                'title' => $data['title'],
                'status' => $data['status'] ?? 'published',
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'og_image' => $data['og_image'] ?? null,
                'noindex' => $data['noindex'] ?? false,
            ]);

            $this->syncSections($page, $data['sections'] ?? []);

            return $page;
        });
    }

    /**
     * Update an existing page.
     */
    public function update(Page $page, array $data): Page
    {
        return DB::transaction(function () use ($page, $data) {
            $page->update([
                'title' => $data['title'],
                'status' => $data['status'] ?? $page->status,
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'og_image' => $data['og_image'] ?? null,
                'noindex' => $data['noindex'] ?? false,
            ]);

            if (isset($data['sections'])) {
                $this->syncSections($page, $data['sections']);
            }

            return $page;
        });
    }

    /**
     * Sync sections for a page.
     */
    protected function syncSections(Page $page, array $sections): void
    {
        // Simple sync: delete old sections and re-create
        $page->sections()->delete();

        foreach ($sections as $index => $section) {
            $page->sections()->create([
                'heading' => $section['heading'],
                'paragraph' => $section['paragraph'],
                'position' => $index,
            ]);
        }
    }

    /**
     * Delete a page.
     */
    public function delete(Page $page): bool
    {
        return $page->delete();
    }
}

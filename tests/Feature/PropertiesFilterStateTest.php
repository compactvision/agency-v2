<?php

it('keeps empty property filters from becoming a React state initializer', function () {
    $controller = file_get_contents(
        app_path('Http/Controllers/PageController.php'),
    );
    $page = file_get_contents(
        resource_path('js/pages/properties/Properties.tsx'),
    );

    expect($controller)
        ->toContain("'filters' => (object) \$filters")
        ->and($page)
        ->toContain('!Array.isArray(rawFilters)')
        ->toContain("typeof filtersProp.sort === 'string'")
        ->toContain('allowedSorts.includes(filtersProp.sort)');
});

it('normalizes the property count and uses skeletons while loading', function () {
    $hook = file_get_contents(resource_path('js/hooks/useAds.ts'));
    $page = file_get_contents(
        resource_path('js/pages/properties/Properties.tsx'),
    );

    expect($hook)
        ->toContain('source.total ?? meta.total ?? data.length')
        ->toContain('setAds(normalizePaginatedAds(result))')
        ->and($page)
        ->toContain('className="skeleton block h-4 w-36 rounded-md"')
        ->toContain("length: viewMode === 'grid' ? 6 : 3")
        ->not->toContain('animate-spin');
});

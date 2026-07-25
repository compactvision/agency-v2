<?php

it('keeps the property validation pagination compact and accessible', function () {
    $page = file_get_contents(
        resource_path('js/pages/dashboard/properties/Validation.tsx')
    );
    $pagination = file_get_contents(
        resource_path('js/components/pagination/Pagination.tsx')
    );

    expect($page)
        ->toContain('properties.meta?.last_page > 1')
        ->and($pagination)
        ->toContain('aria-label="Pagination"')
        ->toContain("aria-current={link.active ? 'page' : undefined}")
        ->toContain('links.slice(1, -1)')
        ->toContain('[scrollbar-width:none]')
        ->not->toContain('dangerouslySetInnerHTML')
        ->not->toContain('justify-content-center');
});

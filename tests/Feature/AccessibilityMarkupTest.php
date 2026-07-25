<?php

it('keeps the public layout keyboard accessible', function () {
    $document = file_get_contents(resource_path('views/app.blade.php'));
    $layout = file_get_contents(
        resource_path('js/components/layouts/Home/App.tsx'),
    );
    $menu = file_get_contents(
        resource_path('js/components/layouts/Home/MobileMenu.tsx'),
    );

    expect($document)
        ->toContain('width=device-width, initial-scale=1')
        ->and($layout)
        ->toContain('href="#main-content"')
        ->toContain('id="main-content"')
        ->and($menu)
        ->toContain('role="dialog"')
        ->toContain('aria-modal="true"')
        ->toContain('inert={!active ? true : undefined}')
        ->toContain('h-11 w-11')
        ->toContain('h-[100dvh]')
        ->not->toContain('overflow-y-auto');
});

it('keeps carousel controls and filters named and stateful', function () {
    $locations = file_get_contents(
        resource_path('js/components/section/home/LocationProperty.tsx'),
    );
    $recent = file_get_contents(
        resource_path('js/components/section/home/RecentProperty.tsx'),
    );

    expect($locations)
        ->toContain('aria-label={t(')
        ->toContain('pauseOnMouseEnter: true')
        ->toContain('reducedMotion')
        ->and($recent)
        ->toContain('aria-pressed={selectedType === tp.id}')
        ->toContain("aria-pressed={viewMode === 'grid'}");
});

it('keeps contact errors programmatically associated with their fields', function () {
    $contact = file_get_contents(
        resource_path('js/components/Contact/ContactForm.tsx'),
    );
    $errors = file_get_contents(
        resource_path('js/components/ui/ErrorText.tsx'),
    );

    expect($contact)
        ->toContain('aria-invalid={Boolean(errors.name)}')
        ->toContain('aria-describedby=')
        ->toContain('disabled={processing}')
        ->toContain('aria-busy={processing}')
        ->and($errors)
        ->toContain('role="alert"');
});

it('prevents automatic mobile input zoom without disabling user zoom', function () {
    $styles = file_get_contents(resource_path('css/app.css'));
    $document = file_get_contents(resource_path('views/app.blade.php'));

    expect($styles)
        ->toContain('@media (max-width: 767px)')
        ->toContain("[contenteditable='true']")
        ->toContain('font-size: 16px !important')
        ->and($document)
        ->toContain('width=device-width, initial-scale=1')
        ->not->toContain('maximum-scale')
        ->not->toContain('user-scalable=no');
});

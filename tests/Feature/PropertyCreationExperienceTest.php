<?php

it('keeps the property description at the end of the information workflow', function () {
    $component = file_get_contents(
        resource_path('js/pages/dashboard/properties/EditProperties.tsx')
    );

    $mediaStep = strpos($component, "id: 'media'");
    $descriptionStep = strpos($component, "id: 'description'");
    $publicationStep = strpos($component, "id: 'publication'");

    expect($mediaStep)->not->toBeFalse()
        ->and($descriptionStep)->not->toBeFalse()
        ->and($publicationStep)->not->toBeFalse()
        ->and($mediaStep)->toBeLessThan($descriptionStep)
        ->and($descriptionStep)->toBeLessThan($publicationStep)
        ->and($component)
        ->toContain('goToSection(activeSectionIndex - 1)')
        ->toContain('activeSectionIndex + 1')
        ->toContain('Le formulaire a été réinitialisé.')
        ->toContain('Description générée avec succès.');
});

it('uses one global toast presenter for success and failed actions', function () {
    $application = file_get_contents(resource_path('js/app.tsx'));
    $toasts = file_get_contents(
        resource_path('js/components/ui/GlobalToasts.tsx')
    );
    $homeLayout = file_get_contents(
        resource_path('js/components/layouts/Home/App.tsx')
    );
    $dashboardLayout = file_get_contents(
        resource_path('js/components/layouts/Dashboard/Dashboard.tsx')
    );

    expect($application)
        ->toContain('initialPageProps=')
        ->and($toasts)
        ->toContain('flash?.success ?? flash?.message')
        ->toContain('toast.error(errorMessage')
        ->toContain("router.on('navigate'")
        ->not->toContain('usePage')
        ->toContain("'verification-link-sent'")
        ->toContain("'passwords.reset'")
        ->and($homeLayout)
        ->not->toContain('<Toaster')
        ->and($dashboardLayout)
        ->not->toContain('<Toaster');
});

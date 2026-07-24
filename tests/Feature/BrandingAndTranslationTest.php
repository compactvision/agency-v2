<?php

function flattenTranslations(array $translations, string $prefix = ''): array
{
    $flattened = [];

    foreach ($translations as $key => $value) {
        $path = $prefix === '' ? $key : "{$prefix}.{$key}";

        if (is_array($value)) {
            $flattened += flattenTranslations($value, $path);
        } else {
            $flattened[$path] = $value;
        }
    }

    return $flattened;
}

function javascriptSourceFiles(): array
{
    $files = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(
            resource_path('js'),
            FilesystemIterator::SKIP_DOTS,
        ),
    );

    foreach ($iterator as $file) {
        if (in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx'], true)) {
            $files[] = $file->getPathname();
        }
    }

    return $files;
}

it('ships the official The Agency light and dark brand assets', function () {
    expect(public_path('brand/the-agency-logo-light.png'))->toBeFile()
        ->and(public_path('brand/the-agency-logo-dark.png'))->toBeFile()
        ->and(public_path('brand/the-agency-mark.png'))->toBeFile()
        ->and(public_path('brand/the-agency-mark-dark.png'))->toBeFile()
        ->and(public_path('favicon.ico'))->toBeFile()
        ->and(public_path('favicon.png'))->toBeFile()
        ->and(public_path('apple-touch-icon.png'))->toBeFile()
        ->and(public_path('favicon.svg'))->not->toBeFile()
        ->and(public_path('logo.svg'))->not->toBeFile();

    foreach (javascriptSourceFiles() as $file) {
        expect(file_get_contents($file))
            ->not->toContain('Laravel Starter Kit')
            ->not->toContain('TheAgencyDRC')
            ->not->toContain('DRC Agency');
    }
});

it('keeps the French and English catalogs complete and in sync', function () {
    $catalogs = [];

    foreach (['fr', 'en'] as $locale) {
        $contents = file_get_contents(
            public_path("locales/{$locale}/translation.json"),
        );
        $catalogs[$locale] = flattenTranslations(
            json_decode($contents, true, flags: JSON_THROW_ON_ERROR),
        );
    }

    expect(array_keys($catalogs['fr']))
        ->toEqualCanonicalizing(array_keys($catalogs['en']));

    $usedKeys = [];

    foreach (javascriptSourceFiles() as $file) {
        preg_match_all(
            '/\bt\(\s*[\'"]([^\'"]+)[\'"]/',
            file_get_contents($file),
            $matches,
        );
        $usedKeys = [...$usedKeys, ...$matches[1]];
    }

    foreach (array_unique($usedKeys) as $key) {
        expect($catalogs['fr'])->toHaveKey($key);
        expect($catalogs['en'])->toHaveKey($key);
    }
});

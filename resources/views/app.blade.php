<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        @php
            $seo = data_get($page, 'props.seo', []);
            $seoTitle = $seo['title'] ?? config('app.name', 'Agency');
            $seoDescription = $seo['description'] ?? 'Plateforme de recherche et de publication de biens immobiliers.';
            $seoCanonical = $seo['canonical'] ?? url()->current();
            $seoImage = $seo['image'] ?? asset('logo.png');
            $seoRobots = $seo['robots'] ?? 'index, follow, max-image-preview:large';
            $seoJsonLd = $seo['json_ld'] ?? [];
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ $seoDescription }}">
        <meta name="robots" content="{{ $seoRobots }}">
        <link rel="canonical" href="{{ $seoCanonical }}">

        {{-- Applique le thème avant le rendu pour éviter un flash clair/sombre. --}}
        <script>
            (function() {
                const savedAppearance = localStorage.getItem('appearance');
                const appearance = savedAppearance || @json($appearance ?? 'system');
                const isDark = appearance === 'dark' ||
                    (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('dark', isDark);
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
            })();
        </script>

        <style>
            html {
                background-color: #f8f8f3;
            }

            html.dark {
                background-color: #292625;
            }
        </style>

        <meta property="og:type" content="{{ $seo['type'] ?? 'website' }}">
        <meta property="og:locale" content="{{ $seo['locale'] ?? 'fr_CD' }}">
        <meta property="og:site_name" content="{{ $seo['site_name'] ?? config('app.name', 'Agency') }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonical }}">
        <meta property="og:image" content="{{ $seoImage }}">
        <meta property="og:image:alt" content="{{ $seoTitle }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImage }}">

        <title inertia>{{ $seoTitle }}</title>

        @if (! empty($seoJsonLd))
            <script type="application/ld+json">{!! json_encode($seoJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
        @endif

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <meta name="theme-color" content="#413D3C">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

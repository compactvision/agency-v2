<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>{{ __('search-alerts.unsubscribe') }}</title>
    <style>body{font:18px/1.6 system-ui;background:#eeefe6;color:#292625;margin:0;padding:32px}main{max-width:560px;margin:10vh auto;background:white;padding:32px;border-radius:16px}button{font:inherit;padding:12px 20px;background:#413d3c;color:white;border:0;border-radius:8px;cursor:pointer}a{color:#413d3c}</style>
</head>
<body><main>
    <h1>{{ __('search-alerts.unsubscribe') }}</h1>
    @if ($done || ! $alert->active)
        <p role="status">{{ __('search-alerts.disabled') }}</p>
    @else
        <p>{{ __('search-alerts.confirm', ['zone' => $alert->municipality->name]) }}</p>
        <form method="post" action="{{ request()->fullUrl() }}">
            @csrf
            <button type="submit">{{ __('search-alerts.unsubscribe') }}</button>
        </form>
    @endif
    <p><a href="{{ route('properties') }}">{{ __('search-alerts.return') }}</a></p>
</main></body>
</html>

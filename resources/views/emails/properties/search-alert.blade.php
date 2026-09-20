<x-mail::message>
# {{ __('search-alerts.subject', ['zone' => $alert->municipality->name]) }}

{{ __('search-alerts.intro', ['zone' => $alert->municipality->name]) }}

<x-mail::panel>
{{ $ad->title }}

{{ number_format((float) $ad->price, 0, ',', ' ') }} {{ $ad->currency }}
</x-mail::panel>

<x-mail::button :url="$propertyUrl">
{{ __('search-alerts.view') }}
</x-mail::button>

[{{ __('search-alerts.unsubscribe') }}]({{ $unsubscribeUrl }})
</x-mail::message>

<x-mail::message>
# {{ __('mail.property_pending.title') }}

{{ __('mail.common.hello', ['name' => $userName]) }}

{!! __('mail.property_pending.intro', ['title' => e($propertyTitle)]) !!}

<x-mail::panel>
**{{ __('mail.common.reference') }} :** {{ $reference }}
</x-mail::panel>

{{ __('mail.property_pending.review') }}

{{ __('mail.property_pending.timing') }}

<x-mail::button :url="$propertiesUrl">
{{ __('mail.property_pending.action') }}
</x-mail::button>

{{ __('mail.common.thank_you') }}

{{ __('mail.common.team') }}
</x-mail::message>

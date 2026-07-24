<x-mail::message>
# {{ __('mail.property_approved.title') }}

{{ __('mail.common.hello', ['name' => $ad->user->name]) }}

{!! __('mail.property_approved.intro', ['title' => e($ad->title)]) !!}

<x-mail::panel>
**{{ __('mail.common.reference') }} :** {{ $ad->reference }}
</x-mail::panel>

{{ __('mail.property_approved.visibility') }}

<x-mail::button :url="$propertyUrl">
{{ __('mail.property_approved.action') }}
</x-mail::button>

{{ __('mail.common.thank_you') }}

{{ __('mail.common.team') }}
</x-mail::message>

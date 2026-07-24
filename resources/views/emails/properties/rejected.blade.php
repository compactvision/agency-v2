<x-mail::message>
# {{ __('mail.property_rejected.title') }}

{{ __('mail.common.hello', ['name' => $ad->user->name]) }}

{!! __('mail.property_rejected.intro', ['title' => e($ad->title)]) !!}

**{{ __('mail.property_rejected.reason') }}**

<x-mail::panel>
{{ $reason }}
</x-mail::panel>

{{ __('mail.property_rejected.next') }}

<x-mail::button :url="$editUrl">
{{ __('mail.property_rejected.action') }}
</x-mail::button>

{{ __('mail.common.team') }}
</x-mail::message>

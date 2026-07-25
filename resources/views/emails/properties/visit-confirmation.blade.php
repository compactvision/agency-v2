<x-mail::message>
# {{ __('mail.property_visit.visitor_title') }}

{{ __('mail.common.hello', ['name' => $visit->visitor_name]) }}

{!! __('mail.property_visit.visitor_intro', ['title' => e($visit->property?->title)]) !!}

<x-mail::panel>
**{{ __('mail.property_visit.date') }} :** {{ $visit->scheduled_at->translatedFormat(__('mail.common.date_time_format')) }}  
**{{ __('mail.common.reference') }} :** {{ $visit->property?->reference }}
</x-mail::panel>

{{ __('mail.property_visit.visitor_next') }}

<x-mail::button :url="$propertyUrl">
{{ __('mail.property_visit.action') }}
</x-mail::button>

{{ __('mail.common.thank_you') }}

{{ __('mail.common.team') }}
</x-mail::message>

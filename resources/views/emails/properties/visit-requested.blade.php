<x-mail::message>
# {{ __('mail.property_visit.owner_title') }}

{{ __('mail.common.hello', ['name' => $visit->owner?->name]) }}

{!! __('mail.property_visit.owner_intro', ['name' => e($visit->visitor_name), 'title' => e($visit->property?->title)]) !!}

<x-mail::panel>
**{{ __('mail.property_visit.date') }} :** {{ $visit->scheduled_at->translatedFormat(__('mail.common.date_time_format')) }}  
**{{ __('mail.property_visit.phone') }} :** {{ $visit->visitor_phone }}  
**{{ __('mail.property_visit.email') }} :** {{ $visit->visitor_email }}

@if($visit->message)
**{{ __('mail.property_visit.message') }} :** {{ $visit->message }}
@endif
</x-mail::panel>

{{ __('mail.property_visit.owner_next') }}

<x-mail::button :url="$propertyUrl">
{{ __('mail.property_visit.action') }}
</x-mail::button>

{{ __('mail.common.team') }}
</x-mail::message>

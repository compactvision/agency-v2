<x-mail::message>
# {{ __('mail.welcome.title') }}

{{ __('mail.common.hello', ['name' => $name]) }}

{!! __('mail.welcome.intro', ['role' => e($role)]) !!}

{{ __('mail.welcome.next') }}

- {{ __('mail.welcome.publish') }}
- {{ __('mail.welcome.manage') }}
- {{ __('mail.welcome.analytics') }}

<x-mail::button :url="$dashboardUrl">
{{ __('mail.welcome.action') }}
</x-mail::button>

{{ __('mail.common.thank_you') }}

{{ __('mail.common.team') }}
</x-mail::message>

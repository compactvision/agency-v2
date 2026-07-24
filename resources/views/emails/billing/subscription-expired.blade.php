<x-mail::message>
# {{ __('mail.billing.expired_title') }}

{{ __('mail.common.hello', ['name' => $subscription->user->name ?? __('mail.common.not_available')]) }}

{!! __('mail.billing.expired_intro', [
    'plan' => e($planName),
    'date' => $subscription->expires_at?->format(__('mail.common.date_format')) ?? __('mail.common.not_available'),
]) !!}

{{ __('mail.billing.expired_effect') }}

<x-mail::button :url="$subscriptionsUrl">
{{ __('mail.billing.renew_action') }}
</x-mail::button>

{{ __('mail.common.team') }}
</x-mail::message>

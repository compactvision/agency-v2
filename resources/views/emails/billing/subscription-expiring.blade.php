<x-mail::message>
# {{ __('mail.billing.expiring_title') }}

{{ __('mail.common.hello', ['name' => $subscription->user->name ?? __('mail.common.not_available')]) }}

@if ($daysRemaining === 0)
{!! __('mail.billing.expires_today', ['plan' => e($planName)]) !!}
@else
{!! trans_choice('mail.billing.expires_later', $daysRemaining, ['plan' => e($planName), 'count' => $daysRemaining]) !!}
@endif

<x-mail::panel>
**{{ __('mail.billing.expiry') }} :** {{ $subscription->expires_at?->format(__('mail.common.date_format')) ?? __('mail.common.not_available') }}
</x-mail::panel>

{{ __('mail.billing.expiring_advice') }}

<x-mail::button :url="$subscriptionsUrl">
{{ __('mail.billing.renew_action') }}
</x-mail::button>

{{ __('mail.common.team') }}
</x-mail::message>

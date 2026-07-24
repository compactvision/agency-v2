<x-mail::message>
# {{ __('mail.billing.activated_title') }}

{{ __('mail.common.hello', ['name' => $subscription->user->name ?? __('mail.common.not_available')]) }}

{!! __('mail.billing.activated_intro', ['plan' => e($planName)]) !!}

<x-mail::table>
| | |
|:--|:--|
| **{{ __('mail.billing.plan') }}** | {{ $planName }} |
| **{{ __('mail.billing.amount') }}** | {{ number_format((float) $subscription->amount, 2, '.', ' ') }} {{ $subscription->currency }} |
| **{{ __('mail.billing.start') }}** | {{ $subscription->started_at?->format(__('mail.common.date_format')) ?? __('mail.common.not_available') }} |
| **{{ __('mail.billing.expiry') }}** | {{ $subscription->expires_at?->format(__('mail.common.date_format')) ?? __('mail.common.unlimited') }} |
</x-mail::table>

<x-mail::button :url="$subscriptionsUrl">
{{ __('mail.billing.activated_action') }}
</x-mail::button>

{{ __('mail.common.thank_you') }}

{{ __('mail.common.team') }}
</x-mail::message>

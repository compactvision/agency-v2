<x-mail::message>
# {{ __('mail.billing.manual_title') }}

{{ __('mail.common.hello_team') }}

{!! __('mail.billing.manual_intro', ['plan' => e($planName)]) !!}

<x-mail::table>
| | |
|:--|:--|
| **{{ __('mail.billing.user_id') }}** | #{{ $userId }} |
| **{{ __('mail.billing.plan') }}** | {{ $planName }} |
| **{{ __('mail.billing.subscription_id') }}** | #{{ $subscriptionId }} |
</x-mail::table>

{{ __('mail.billing.manual_instruction') }}

<x-mail::button :url="$paymentRequestsUrl">
{{ __('mail.billing.manual_action') }}
</x-mail::button>

{{ __('mail.common.automated_notice') }}
</x-mail::message>

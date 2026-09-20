<x-mail::message>
# {{ __('subscriptions.mail.'.$notice->kind) }}

{{ __('mail.common.hello', ['name' => $sub->user->name]) }}

**{{ $sub->plan_name ?: $sub->plan?->name }}**

{{ __('subscriptions.validity', ['start' => $sub->started_at?->format('d/m/Y H:i T'), 'end' => $sub->expires_at?->format('d/m/Y H:i T')]) }}

@if ($notice->kind === 'activated')
{{ __('subscriptions.restored', ['count' => $notice->context['restored'] ?? 0, 'hidden' => $notice->context['hidden'] ?? 0]) }}
@elseif ($notice->kind === 'expiring')
{{ __('subscriptions.expiring', ['days' => $days, 'count' => $published]) }}
@else
{{ __('subscriptions.expired', ['count' => $hidden]) }}
@endif

<x-mail::button :url="$renewUrl">
{{ __('subscriptions.renew') }}
</x-mail::button>

{{ __('mail.common.team') }}
</x-mail::message>

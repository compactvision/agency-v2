<x-mail::message>
# {{ __('mail.admin_property.title') }}

{{ __('mail.admin_property.intro') }}

<x-mail::table>
| | |
|:--|:--|
| **{{ __('mail.admin_property.title_label') }}** | {{ $propertyTitle }} |
| **{{ __('mail.common.reference') }}** | {{ $reference }} |
| **{{ __('mail.admin_property.owner') }}** | {{ $userName }} |
| **{{ __('mail.admin_property.email') }}** | [{{ $userEmail }}](mailto:{{ $userEmail }}) |
</x-mail::table>

{{ __('mail.admin_property.instruction') }}

<x-mail::button :url="$validationUrl">
{{ __('mail.admin_property.action') }}
</x-mail::button>

{{ __('mail.common.automated_notice') }}
</x-mail::message>

<x-mail::message>
# {{ __('mail.contact.title') }}

{{ __('mail.contact.intro') }}

<x-mail::table>
| | |
|:--|:--|
| **{{ __('mail.contact.name') }}** | {{ $contact['name'] }} |
| **{{ __('mail.contact.email') }}** | [{{ $contact['email'] }}](mailto:{{ $contact['email'] }}) |
| **{{ __('mail.contact.phone') }}** | {{ $contact['phone'] ?: __('mail.common.not_provided') }} |
| **{{ __('mail.contact.subject') }}** | {{ $contact['subject'] }} |
</x-mail::table>

**{{ __('mail.contact.message') }}**

<x-mail::panel>
{{ $contact['message'] }}
</x-mail::panel>

{{ __('mail.contact.reply') }}
</x-mail::message>

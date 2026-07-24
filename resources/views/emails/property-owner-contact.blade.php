<x-mail::message>
# {{ __('mail.enquiry.title') }}

{{ __('mail.common.hello', ['name' => $ad->user->name]) }}

{!! __('mail.enquiry.intro', ['name' => e($sender->name), 'title' => e($ad->title)]) !!}

<x-mail::table>
| | |
|:--|:--|
| **{{ __('mail.common.reference') }}** | {{ $ad->reference }} |
| **{{ __('mail.enquiry.sender') }}** | {{ $sender->name }} |
| **{{ __('mail.enquiry.email') }}** | [{{ $sender->email }}](mailto:{{ $sender->email }}) |
| **{{ __('mail.enquiry.phone') }}** | {{ $contact['phone'] ?: __('mail.common.not_provided') }} |
</x-mail::table>

**{{ __('mail.enquiry.message') }}**

<x-mail::panel>
{{ $contact['message'] }}
</x-mail::panel>

{{ __('mail.enquiry.reply') }}

<x-mail::button :url="$propertyUrl">
{{ __('mail.enquiry.action') }}
</x-mail::button>

<x-mail::panel>
{{ __('mail.enquiry.safety') }}
</x-mail::panel>
</x-mail::message>

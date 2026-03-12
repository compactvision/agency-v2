@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === config('app.name'))
                <img src="{{ config('app.url') }}/logo.svg" class="logo" alt="{{ config('app.name') }} Logo">
            @else
                {{ $slot }}
            @endif
        </a>
    </td>
</tr>
@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === config('app.name'))
                <img src="{{ config('app.url') }}/brand/the-agency-logo-light.png" class="logo" alt="{{ config('app.name') }}">
            @else
                {{ $slot }}
            @endif
        </a>
    </td>
</tr>

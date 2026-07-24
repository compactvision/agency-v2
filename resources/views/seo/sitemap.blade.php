{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
@foreach ($entries as $entry)
    <url>
        <loc>{{ $entry['loc'] }}</loc>
@if ($entry['lastmod'])
        <lastmod>{{ $entry['lastmod'] }}</lastmod>
@endif
        <priority>{{ $entry['priority'] }}</priority>
@if ($entry['image'] ?? null)
        <image:image>
            <image:loc>{{ $entry['image'] }}</image:loc>
            <image:title>{{ $entry['image_title'] }}</image:title>
        </image:image>
@endif
    </url>
@endforeach
</urlset>

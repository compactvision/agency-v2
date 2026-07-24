<?php

namespace App\Domains\CMS\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'status',
        'meta_title',
        'meta_description',
        'og_image',
        'noindex',
    ];

    protected function casts(): array
    {
        return [
            'noindex' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (empty($page->slug)) {
                $page->slug = Str::slug($page->title);
            }
        });

        static::saved(fn () => Cache::forget('seo.sitemap.entries'));
        static::deleted(fn () => Cache::forget('seo.sitemap.entries'));
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('position');
    }
}

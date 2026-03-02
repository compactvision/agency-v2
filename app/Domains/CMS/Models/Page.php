<?php

namespace App\Domains\CMS\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'status'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (empty($page->slug)) {
                $page->slug = Str::slug($page->title);
            }
        });

        static::updating(function ($page) {
            if ($page->isDirty('title') && !$page->isDirty('slug')) {
                $page->slug = Str::slug($page->title);
            }
        });
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('position');
    }
}

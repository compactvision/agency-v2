<?php

namespace App\Domains\CMS\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = ['page_id', 'heading', 'paragraph', 'position'];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}

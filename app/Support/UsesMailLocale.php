<?php

namespace App\Support;

trait UsesMailLocale
{
    protected function useMailLocale(?string $locale): void
    {
        $this->locale(in_array($locale, ['fr', 'en'], true)
            ? $locale
            : config('app.fallback_locale', 'fr'));
    }
}

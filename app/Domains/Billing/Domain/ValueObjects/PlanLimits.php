<?php

namespace App\Domains\Billing\Domain\ValueObjects;

use Illuminate\Support\Collection;

final class PlanLimits
{
    public function __construct(
        public readonly int  $listingLimit,
        public readonly int  $imageLimit,
        public readonly bool $isFeatured,
        public readonly bool $analyticsAccess,
        public readonly bool $prioritySupport,
        public readonly bool $highlightHomepage,
    ) {}

    /**
     * Build from a collection of PlanFeature models.
     */
    public static function fromFeatures(Collection $features): self
    {
        $get = fn(string $key, mixed $default): mixed =>
            $features->firstWhere('name', $key)?->value ?? $default;

        return new self(
            listingLimit:      (int)  $get('listing_limit', 0),
            imageLimit:        (int)  $get('image_limit', 0),
            isFeatured:        (bool) $get('is_featured', false),
            analyticsAccess:   (bool) $get('analytics_access', false),
            prioritySupport:   (bool) $get('priority_support', false),
            highlightHomepage: (bool) $get('highlight_homepage', false),
        );
    }

    public function toArray(): array
    {
        return [
            'listing_limit'     => $this->listingLimit,
            'image_limit'       => $this->imageLimit,
            'is_featured'       => $this->isFeatured,
            'analytics_access'  => $this->analyticsAccess,
            'priority_support'  => $this->prioritySupport,
            'highlight_homepage'=> $this->highlightHomepage,
        ];
    }
}

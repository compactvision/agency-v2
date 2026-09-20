<?php

namespace App\Domains\Billing\Domain\ValueObjects;

use Illuminate\Support\Collection;

final class PlanLimits
{
    public function __construct(
        public readonly int $listingLimit,
        public readonly int $imageLimit,
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
        $get = fn (string $key, mixed $default): mixed => $features->firstWhere('name', $key)?->value ?? $default;
        $limit = static function ($value, bool $zeroUnlimited = false): int {
            if (is_string($value) && strtolower(trim($value)) === 'unlimited') {
                return PHP_INT_MAX;
            }
            if ($value === null || ! is_numeric($value) || (int) $value < 0) {
                return 0;
            }

            return $zeroUnlimited && (int) $value === 0 ? PHP_INT_MAX : (int) $value;
        };
        $listing = $get('listing_limit', null);
        $images = $get('image_limit', null);

        return new self(
            listingLimit: $limit($listing ?? $get('Listings per month', null), $listing !== null),
            imageLimit: $limit($images ?? $get('Images per ad', null), $images !== null),
            isFeatured: filter_var($get('is_featured', false), FILTER_VALIDATE_BOOLEAN),
            analyticsAccess: filter_var($get('analytics_access', false), FILTER_VALIDATE_BOOLEAN),
            prioritySupport: filter_var($get('priority_support', false), FILTER_VALIDATE_BOOLEAN),
            highlightHomepage: filter_var($get('highlight_homepage', false), FILTER_VALIDATE_BOOLEAN),
        );
    }

    public function toArray(): array
    {
        return [
            'listing_limit' => $this->listingLimit,
            'image_limit' => $this->imageLimit,
            'is_featured' => $this->isFeatured,
            'analytics_access' => $this->analyticsAccess,
            'priority_support' => $this->prioritySupport,
            'highlight_homepage' => $this->highlightHomepage,
        ];
    }
}

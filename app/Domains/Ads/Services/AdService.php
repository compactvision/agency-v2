<?php

namespace App\Domains\Ads\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Models\AdDetail;
use App\Domains\Quotas\Services\QuotaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdService
{
    public function __construct(
        protected QuotaService $quota,
        protected AdSchemaValidator $schemaValidator
    ) {
    }

    /* =========================================================
     | CREATE
     |=========================================================*/
    public function create(array $data, int $userId): Ad
    {
        // FULL schema validation
        $this->schemaValidator->validate($data, 'create');

        return DB::transaction(function () use ($data, $userId) {

            $ad = Ad::create([
                'user_id' => $userId,
                'category_id' => $data['category_id'],
                'ad_type' => $data['ad_type'],
                'reference' => 'AD-' . strtoupper(Str::random(8)),
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'currency' => $data['currency'] ?? 'USD',
                'surface' => $data['surface'] ?? null,
                'country_id' => $data['country_id'] ?? null,
                'city_id' => $data['city_id'] ?? null,
                'municipality_id' => $data['municipality_id'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'status' => 'draft',
                'is_published' => false,
            ]);

            AdDetail::create([
                'ad_id' => $ad->id,
                'details' => $data['details'],
            ]);

            if (!empty($data['amenities'])) {
                $ad->amenities()->sync($data['amenities']);
            }

            $this->handleImages($ad, $data);

            return $ad->load(['details', 'amenities', 'images']);
        });
    }

    /* =========================================================
     | UPDATE
     |=========================================================*/
    public function update(Ad $ad, array $data): array
    {
        return DB::transaction(function () use ($ad, $data) {

            $changed = false;
            $changes = [];

            /*
            |------------------------------------------------------
            | 1. SIMPLE FIELDS (TYPE-SAFE COMPARISON)
            |------------------------------------------------------
            */
            $adFields = collect($data)->except(['details', 'amenities', 'images', 'images_to_delete', 'image_positions'])->toArray();

            foreach ($adFields as $key => $value) {
                $current = $ad->{$key};

                if (is_numeric($current) && is_numeric($value)) {
                    if ((float) $current !== (float) $value) {
                        $changes[$key] = $value;
                    }
                    continue;
                }

                if (is_bool($current)) {
                    if ((bool) $current !== (bool) $value) {
                        $changes[$key] = $value;
                    }
                    continue;
                }

                if ($current !== $value) {
                    $changes[$key] = $value;
                }
            }

            if (!empty($changes)) {
                $ad->update($changes);
                $changed = true;
            }

            /*
            |------------------------------------------------------
            | 2. DETAILS (PATCH MERGE + SCHEMA VALIDATION)
            |------------------------------------------------------
            */
            if (array_key_exists('details', $data)) {

                $existing = $ad->details?->details ?? [];
                $merged = array_replace_recursive($existing, $data['details']);

                // ✅ VALIDATE FINAL STATE (NO REQUIRED)
                $this->schemaValidator->validate([
                    'category_id' => $ad->category_id,
                    'ad_type' => $ad->ad_type,
                    'details' => $merged,
                ], 'update');

                if ($this->normalizeArray($merged) !== $this->normalizeArray($existing)) {
                    $ad->details()->updateOrCreate(
                        ['ad_id' => $ad->id],
                        ['details' => $merged]
                    );
                    $changed = true;
                }
            }


            /*
            |--------------------------------------------------------------
            | 3. AMENITIES (PATCH SAFE + NO-OP DETECTION)
            |--------------------------------------------------------------
            */
            if (array_key_exists('amenities', $data)) {

                $currentIds = $ad->amenities()
                    ->pluck('amenities.id')
                    ->map(fn($id) => (int) $id)
                    ->toArray();

                $toAdd = collect($data['amenities']['add'] ?? [])
                    ->map(fn($id) => (int) $id)
                    ->diff($currentIds)
                    ->values()
                    ->toArray();

                $toRemove = collect($data['amenities']['remove'] ?? [])
                    ->map(fn($id) => (int) $id)
                    ->intersect($currentIds)
                    ->values()
                    ->toArray();

                if (!empty($toAdd)) {
                    $ad->amenities()->attach($toAdd);
                    $changed = true;
                }

                if (!empty($toRemove)) {
                    $ad->amenities()->detach($toRemove);
                    $changed = true;
                }
            }

            /*
            |--------------------------------------------------------------
            | 4. IMAGES
            |--------------------------------------------------------------
            */
            if ($this->handleImages($ad, $data)) {
                $changed = true;
            }


            /*
            |------------------------------------------------------
            | 5. NO CHANGES
            |------------------------------------------------------
            */
            if (!$changed) {
                return [
                    'no_changes' => true,
                    'ad' => $ad->load(['details', 'amenities', 'images']),
                ];
            }

            return [
                'no_changes' => false,
                'ad' => $ad->fresh(['details', 'amenities', 'images']),
            ];
        });
    }

    private function handleImages(Ad $ad, array $data): bool
    {
        $changed = false;

        // 1. Delete
        if (!empty($data['images_to_delete'])) {
            $imagesToDelete = $ad->images()->whereIn('id', $data['images_to_delete'])->get();
            foreach ($imagesToDelete as $img) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($img->path);
                $img->delete();
                $changed = true;
            }
        }

        // 2. Upload New
        $newUploadedImages = [];
        if (!empty($data['images'])) {
            foreach ($data['images'] as $index => $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $path = $file->store('ads/' . $ad->id, 'public');
                    $newImg = $ad->images()->create([
                        'path' => $path,
                        'position' => 999, // Temp position
                    ]);
                    $newUploadedImages[$index] = $newImg;
                    $changed = true;
                }
            }
        }

        // 3. Reorder using image_order
        // Payload 'image_order' format: ['existing:1', 'new:0', 'existing:5', ...]
        if (!empty($data['image_order'])) {
            foreach ($data['image_order'] as $position => $orderItem) {
                if (str_starts_with($orderItem, 'existing:')) {
                    $id = (int) str_replace('existing:', '', $orderItem);
                    $img = $ad->images()->find($id);
                    if ($img && $img->position !== $position) {
                        $img->update(['position' => $position]);
                        $changed = true;
                    }
                } elseif (str_starts_with($orderItem, 'new:')) {
                    $index = (int) str_replace('new:', '', $orderItem);
                    if (isset($newUploadedImages[$index])) {
                        $img = $newUploadedImages[$index];
                        if ($img->position !== $position) {
                            $img->update(['position' => $position]);
                            $changed = true;
                        }
                    }
                }
            }
        } elseif (!empty($data['image_positions'])) {
            // Fallback for old logic if needed, or if only reordering existing
            $positions = array_flip($data['image_positions']);
            $images = $ad->images()->get();
            foreach ($images as $img) {
                if (isset($positions[$img->id])) {
                    $newPos = $positions[$img->id];
                    if ($img->position !== $newPos) {
                        $img->update(['position' => $newPos]);
                        $changed = true;
                    }
                }
            }
        }

        return $changed;
    }

    private function normalizeArray(array $array): array
    {
        foreach ($array as $k => $v) {
            if (is_array($v)) {
                $array[$k] = $this->normalizeArray($v);
            }
        }

        ksort($array);
        return $array;
    }

    /* =========================================================
     | SUBMIT
     |=========================================================*/
    public function submit(Ad $ad): Ad
    {
        if ($ad->status !== 'draft') {
            throw new \Exception('Only draft ads can be submitted');
        }

        $this->quota->consume(
            $ad->user_id,
            $ad->user->subscription,
            1
        );

        $ad->update([
            'status' => 'pending_validation',
        ]);

        // Send Emails
        try {
            \Illuminate\Support\Facades\Mail::to($ad->user->email)
                ->send(new \App\Mail\PropertyValidationPending($ad));

            $adminEmail = config('mail.from.address'); // Or a specific admin email
            \Illuminate\Support\Facades\Mail::to($adminEmail)
                ->send(new \App\Mail\AdminNewPropertyNotification($ad));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send property validation emails: " . $e->getMessage());
        }

        return $ad;
    }

    /* =========================================================
     | ADMIN
     |=========================================================*/
    public function approve(Ad $ad): Ad
    {
        if ($ad->status !== 'pending_validation') {
            throw new \Exception('Only pending ads can be approved');
        }

        $ad->update([
            'status' => 'published',
            'is_published' => true,
            'rejection_reason' => null,
        ]);

        return $ad;
    }

    public function reject(Ad $ad, string $reason): Ad
    {
        if ($ad->status !== 'pending_validation') {
            throw new \Exception('Only pending ads can be rejected');
        }

        $ad->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'is_published' => false,
        ]);

        return $ad;
    }

    /* =========================================================
     | PUBLIC
     |=========================================================*/
    /* =========================================================
     | PUBLIC
     |=========================================================*/
    public function publicList(array $filters = [])
    {
        $query = Ad::where('status', 'published')
            ->where('is_published', true)
            ->with(['category', 'amenities', 'images', 'details', 'user', 'municipality', 'city', 'country']);

        // 1. Search (Title, Description, Reference)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        // 2. Filters
        if (!empty($filters['sale_type'])) {
            $query->where('ad_type', $filters['sale_type']);
        }

        if (!empty($filters['type'])) {
            // Assuming 'type' maps to category name or similar. 
            // If it's category_id, use that. If it's a string looking up category, we need relation.
            // For now assuming strict mapping if passed, but frontend sends string names often.
            // Let's assume it matches a category name or slug if joined, or just ignored if not ID.
            // Given frontend usage, let's try to match category slug or name via relation if possible.
            // Or if frontend sends ID? Frontend sends string. 
            // Let's filter by category name for now.
            $query->whereHas('category', function($q) use ($filters) {
                $q->where('name', $filters['type'])
                  ->orWhere('slug', $filters['type']);
            });
        }

        if (!empty($filters['municipality_id'])) {
            $query->where('municipality_id', $filters['municipality_id']);
        }

        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (!empty($filters['bedrooms'])) {
            // stored in json column 'details' -> 'bedrooms'? Or separate column?
            // Ad model fillable has 'bedrooms' not listed explicitly as column, 
            // but Ad table likely has them or they are in details.
            // Looking at AdService create, it puts 'details' into AdDetail model.
            // So we need to query AdDetail.
             $query->whereHas('details', function($q) use ($filters) {
                $q->where('details->bedrooms', '>=', $filters['bedrooms']);
            });
        }

        if (!empty($filters['bathrooms'])) {
             $query->whereHas('details', function($q) use ($filters) {
                $q->where('details->bathrooms', '>=', $filters['bathrooms']);
            });
        }

        if (!empty($filters['amenities']) && is_array($filters['amenities'])) {
            $query->whereHas('amenities', function($q) use ($filters) {
                $q->whereIn('amenities.id', $filters['amenities']);
            });
        }

        // 3. Sort
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'low_price':
                $query->orderBy('price', 'asc');
                break;
            case 'high_price':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate(12);
    }

    public function getPublicAd($id)
    {
        return Ad::where('status', 'published')
            ->where('is_published', true)
            ->where('id', $id)
            ->with(['category', 'amenities', 'images', 'details', 'user', 'municipality', 'city', 'country'])
            ->firstOrFail();
    }
}

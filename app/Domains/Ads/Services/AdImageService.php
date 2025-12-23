<?php

namespace App\Domains\Ads\Services;

use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Models\AdImage;
use App\Domains\Quotas\Services\QuotaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdImageService
{
    public function __construct(
        protected QuotaService $quota
    ) {
    }

    /**
     * Ajouter plusieurs images
     */
    public function addImages(Ad $ad, array $files)
    {
        // 🔒 1. Sécurité état
        if ($ad->status !== 'draft') {
            throw new \Exception("Images can only be modified on draft ads");
        }

        // 🔒 2. Vérification QUOTA IMAGES
        if (!$this->quota->canAddImages($ad, count($files))) {
            throw new \Exception("Image limit reached for your plan");
        }

        return DB::transaction(function () use ($ad, $files) {

            $position = $ad->images()->max('position') ?? 0;
            $created = [];

            foreach ($files as $file) {
                $path = $file->store('ads', 'public');

                $created[] = AdImage::create([
                    'ad_id' => $ad->id,
                    'path' => $path,
                    'position' => ++$position,
                ]);
            }

            return $created;
        });
    }

    /**
     * Supprimer une image
     */
    public function deleteImage(AdImage $image): void
    {
        Storage::disk('public')->delete($image->path);
        $image->delete();
    }

    /**
     * Réordonner les images
     */
    public function reorderImages(Ad $ad, array $imageIds): void
    {
        DB::transaction(function () use ($ad, $imageIds) {
            foreach ($imageIds as $index => $id) {
                AdImage::where('id', $id)
                    ->where('ad_id', $ad->id)
                    ->update(['position' => $index + 1]);
            }
        });
    }
}

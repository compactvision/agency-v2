<?php

namespace App\Domains\Ads\Controllers;

use App\Support\ApiResponse;
use App\Domains\Ads\Models\Ad;
use App\Domains\Ads\Models\AdImage;
use App\Domains\Ads\Services\AdImageService;
use App\Domains\Ads\Requests\StoreAdImageRequest;
use App\Domains\Ads\Requests\ReorderAdImagesRequest;
use Illuminate\Support\Facades\Auth;

class AdImageController
{
    public function __construct(
        protected AdImageService $service
    ) {}

    /**
     * Ajouter une ou plusieurs images
     */
    public function store(StoreAdImageRequest $request, Ad $ad)
    {
        if ($ad->user_id !== Auth::id()) {
            return ApiResponse::error("Forbidden", 403);
        }

        if ($ad->status !== 'draft') {
            return ApiResponse::error("Images can only be modified on draft ads", 403);
        }

        $images = $this->service->addImages($ad, $request->file('images'));

        return ApiResponse::success($images, "Images added");
    }

    /**
     * Supprimer une image
     */
    public function destroy(AdImage $image)
    {
        if ($image->ad->user_id !== Auth::id()) {
            return ApiResponse::error("Forbidden", 403);
        }

        if ($image->ad->status !== 'draft') {
            return ApiResponse::error("Images can only be modified on draft ads", 403);
        }

        $this->service->deleteImage($image);

        return ApiResponse::success(null, "Image deleted");
    }

    /**
     * Réordonner les images
     */
    public function reorder(ReorderAdImagesRequest $request, Ad $ad)
    {
        if ($ad->user_id !== Auth::id()) {
            return ApiResponse::error("Forbidden", 403);
        }

        if ($ad->status !== 'draft') {
            return ApiResponse::error("Images can only be modified on draft ads", 403);
        }

        $this->service->reorderImages($ad, $request->image_ids);

        return ApiResponse::success(null, "Images reordered");
    }
}

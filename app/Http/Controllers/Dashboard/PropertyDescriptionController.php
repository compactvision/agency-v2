<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\PropertyDescriptionAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class PropertyDescriptionController extends Controller
{
    public function generate(
        Request $request,
        PropertyDescriptionAiService $generator
    ): JsonResponse {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:80'],
            'sale_type' => ['required', 'in:sale,rent'],
            'municipality' => ['nullable', 'string', 'max:120'],
            'quarter' => ['nullable', 'string', 'max:120'],
            'address' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'surface' => ['nullable', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'rooms' => ['nullable', 'integer', 'min:0'],
            'kitchens' => ['nullable', 'integer', 'min:0'],
            'condition' => ['nullable', 'string', 'max:80'],
            'furnished' => ['nullable', 'boolean'],
            'rental_guarantee' => ['nullable', 'numeric', 'min:0'],
            'garages' => ['nullable', 'integer', 'min:0'],
            'garage_size' => ['nullable', 'numeric', 'min:0'],
            'balconies' => ['nullable', 'integer', 'min:0'],
            'terraces' => ['nullable', 'integer', 'min:0'],
            'floor' => ['nullable', 'integer', 'min:0'],
            'total_floors' => ['nullable', 'integer', 'min:0'],
            'year_built' => ['nullable', 'integer', 'min:1800', 'max:'.(date('Y') + 5)],
            'construction_year' => ['nullable', 'integer', 'min:1800', 'max:'.(date('Y') + 5)],
            'renovation_year' => ['nullable', 'integer', 'min:1800', 'max:'.(date('Y') + 5)],
            'elevator' => ['nullable', 'boolean'],
            'parking' => ['nullable', 'boolean'],
            'garden' => ['nullable', 'boolean'],
            'swimming_pool' => ['nullable', 'boolean'],
            'cellar' => ['nullable', 'boolean'],
            'attic' => ['nullable', 'boolean'],
            'urgency' => ['nullable', 'string', 'max:40'],
            'land_surface' => ['nullable', 'numeric', 'min:0'],
            'land_type' => ['nullable', 'string', 'max:80'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:120'],
            'previous_description' => ['nullable', 'string', 'max:5000'],
            'language' => ['nullable', 'in:fr,en'],
        ]);

        try {
            $description = $generator->generate(
                $data,
                hash('sha256', 'property-description:'.$request->user()->getAuthIdentifier())
            );
        } catch (RuntimeException $exception) {
            return response()->json(['error' => $exception->getMessage()], 503);
        }

        return response()->json(['description' => $description]);
    }
}

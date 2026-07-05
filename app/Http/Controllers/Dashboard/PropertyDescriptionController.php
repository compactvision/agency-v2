<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyDescriptionController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
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
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:120'],
        ]);

        return response()->json([
            'description' => $this->buildDescription($data),
        ]);
    }

    protected function buildDescription(array $data): string
    {
        $type = $this->label($data['type']);
        $saleType = $data['sale_type'] === 'rent' ? 'à louer' : 'à vendre';
        $location = collect([
            $data['quarter'] ?? null,
            $data['municipality'] ?? null,
        ])->filter()->implode(', ');

        $headline = trim(($data['title'] ?? '') ?: "{$type} {$saleType}");
        $intro = $location
            ? "{$headline}, situé à {$location}, offre un cadre idéal pour un projet immobilier sérieux."
            : "{$headline} offre un cadre idéal pour un projet immobilier sérieux.";

        $details = collect([
            !empty($data['surface']) ? "{$data['surface']} m²" : null,
            isset($data['bedrooms']) ? "{$data['bedrooms']} chambre(s)" : null,
            isset($data['bathrooms']) ? "{$data['bathrooms']} salle(s) de bain" : null,
            isset($data['rooms']) ? "{$data['rooms']} pièce(s)" : null,
            isset($data['kitchens']) ? "{$data['kitchens']} cuisine(s)" : null,
        ])->filter()->implode(', ');

        $sentences = [$intro];

        if ($details !== '') {
            $sentences[] = "Le bien propose {$details}, avec une distribution pensée pour le confort au quotidien.";
        }

        if (!empty($data['condition']) || array_key_exists('furnished', $data)) {
            $condition = !empty($data['condition']) ? 'en ' . $this->conditionLabel($data['condition']) : 'bien entretenu';
            $furnished = !empty($data['furnished']) ? ' et livré meublé' : '';
            $sentences[] = "Il se présente {$condition}{$furnished}, prêt à accueillir ses futurs occupants.";
        }

        $amenities = collect($data['amenities'] ?? [])->filter()->values();
        if ($amenities->isNotEmpty()) {
            $sentences[] = 'Les atouts notables incluent ' . $amenities->take(5)->implode(', ') . '.';
        }

        if (!empty($data['price'])) {
            $priceLabel = number_format((float) $data['price'], 0, ',', ' ');
            $sentences[] = $data['sale_type'] === 'rent'
                ? "Le loyer est fixé à {$priceLabel} USD par mois."
                : "Le prix demandé est de {$priceLabel} USD.";
        }

        $sentences[] = 'Une opportunité à visiter rapidement pour confirmer son potentiel sur place.';

        return implode("\n\n", $sentences);
    }

    protected function label(string $value): string
    {
        return match ($value) {
            'house', 'maison' => 'Maison',
            'apartment', 'appartement' => 'Appartement',
            'land', 'terrain' => 'Terrain',
            'building', 'immeuble' => 'Immeuble',
            'office', 'bureau' => 'Bureau',
            'warehouse', 'entrepot' => 'Entrepôt',
            default => ucfirst(str_replace(['_', '-'], ' ', $value)),
        };
    }

    protected function conditionLabel(string $value): string
    {
        return match ($value) {
            'new' => 'état neuf',
            'good' => 'bon état',
            'old' => 'état ancien',
            'renovated' => 'état rénové',
            'to_renovate', 'renovation_needed' => 'état à rénover',
            default => strtolower(str_replace(['_', '-'], ' ', $value)),
        };
    }
}

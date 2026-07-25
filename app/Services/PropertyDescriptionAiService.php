<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class PropertyDescriptionAiService
{
    /**
     * @param  array<string, mixed>  $property
     */
    public function generate(array $property, string $safetyIdentifier): string
    {
        $apiKey = (string) config('services.gemini.api_key');

        if ($apiKey === '') {
            throw new RuntimeException(
                'Le service de génération IA n’est pas encore configuré.'
            );
        }

        $response = Http::baseUrl(
            (string) config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta')
        )
            ->withHeaders(['x-goog-api-key' => $apiKey])
            ->acceptJson()
            ->asJson()
            ->timeout((int) config('services.gemini.timeout', 45))
            ->retry(2, 300, function ($exception) {
                return $exception instanceof ConnectionException
                    || ($exception instanceof RequestException
                        && $exception->response->serverError());
            }, throw: false)
            ->post('/interactions', [
                'model' => config('services.gemini.model', 'gemini-3.5-flash-lite'),
                'system_instruction' => $this->instructions(),
                'input' => $this->input($property),
                'store' => false,
                'labels' => [
                    'requester' => substr($safetyIdentifier, 0, 63),
                ],
                'generation_config' => [
                    'max_output_tokens' => 700,
                    'thinking_level' => 'minimal',
                    'thinking_summaries' => 'none',
                ],
                'response_format' => [
                    'type' => 'text',
                    'mime_type' => 'text/plain',
                ],
            ]);

        if ($response->status() === 429) {
            throw new RuntimeException(
                'Le quota gratuit de génération IA est momentanément atteint. Veuillez réessayer plus tard.'
            );
        }

        if ($response->failed()) {
            report(new RuntimeException(
                "Gemini property description request failed with status {$response->status()}."
            ));

            throw new RuntimeException(
                'La génération IA est momentanément indisponible. Veuillez réessayer.'
            );
        }

        $description = $this->extractText($response->json());

        if (mb_strlen($description) < 80) {
            throw new RuntimeException(
                'La réponse IA est incomplète. Veuillez relancer la génération.'
            );
        }

        return $this->clean($description);
    }

    private function instructions(): string
    {
        return <<<'PROMPT'
Tu es un rédacteur immobilier senior pour The Agency en République démocratique du Congo.

Rédige une description d'annonce naturelle, professionnelle, persuasive et factuellement exacte à partir des seules données fournies.

Règles impératives :
- adapte le vocabulaire, les bénéfices mis en avant et la structure au type de bien, à la transaction, à la localisation et aux équipements réellement fournis ;
- n'invente aucune caractéristique, proximité, vue, sécurité, rendement, disponibilité ou qualité absente des données ;
- privilégie 3 à 5 paragraphes courts, entre 130 et 220 mots ;
- varie fortement l'accroche, le rythme, l'ordre des informations et la conclusion à chaque demande ;
- évite les formulations génériques répétitives, les listes à puces, les titres, le Markdown et les superlatifs invérifiables ;
- si une description précédente est fournie, ne la paraphrase pas : produis une nouvelle version dont l'accroche, la structure et la majorité des formulations sont différentes ;
- conserve exactement les nombres, la devise et les noms de lieux fournis ;
- écris uniquement dans la langue demandée ;
- retourne uniquement la description finale, sans commentaire sur ton travail.
PROMPT;
    }

    /**
     * @param  array<string, mixed>  $property
     */
    private function input(array $property): string
    {
        $styles = [
            'sobre et haut de gamme, centré sur l’usage quotidien',
            'chaleureux et immersif, centré sur l’expérience des futurs occupants',
            'direct et précis, centré sur les atouts concrets et la transaction',
            'élégant et narratif, avec une accroche courte et distinctive',
            'dynamique et commercial, sans exagération ni formule creuse',
        ];

        $payload = [
            'langue' => ($property['language'] ?? 'fr') === 'en' ? 'anglais' : 'français',
            'orientation_redactionnelle' => $styles[array_rand($styles)],
            'identifiant_de_variation' => (string) Str::uuid(),
            'donnees_propriete' => collect($property)
                ->except(['language', 'previous_description'])
                ->filter(fn ($value) => $value !== null && $value !== '' && $value !== [])
                ->all(),
            'description_precedente_a_eviter' => $property['previous_description'] ?? null,
        ];

        return (string) json_encode(
            $payload,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function extractText(array $response): string
    {
        return collect($response['steps'] ?? [])
            ->where('type', 'model_output')
            ->flatMap(fn (array $step) => $step['content'] ?? [])
            ->where('type', 'text')
            ->pluck('text')
            ->filter()
            ->implode("\n\n");
    }

    private function clean(string $description): string
    {
        $description = trim($description);
        $description = preg_replace('/^```(?:text|markdown)?\s*/i', '', $description) ?? $description;
        $description = preg_replace('/\s*```$/', '', $description) ?? $description;

        return trim($description, " \n\r\t\v\0\"");
    }
}

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
    public function generate(array $property): string
    {
        $apiKey = (string) config('services.gemini.api_key');

        if ($apiKey === '') {
            throw new RuntimeException(
                'Le service de génération IA n’est pas encore configuré.'
            );
        }

        $model = (string) config('services.gemini.model', 'gemini-3.5-flash-lite');

        try {
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
                ->post('/models/'.rawurlencode($model).':generateContent', [
                    'systemInstruction' => [
                        'parts' => [
                            ['text' => $this->instructions()],
                        ],
                    ],
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => $this->input($property)],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 700,
                        'responseMimeType' => 'text/plain',
                    ],
                ],
                );
        } catch (ConnectionException $exception) {
            report($exception);

            throw new RuntimeException(
                'Impossible de joindre le service Gemini. Vérifiez la connexion sortante du serveur puis réessayez.'
            );
        }

        if ($response->status() === 429) {
            throw new RuntimeException(
                'Le quota gratuit de génération IA est momentanément atteint. Veuillez réessayer plus tard.'
            );
        }

        if (in_array($response->status(), [401, 403], true)) {
            throw new RuntimeException(
                'La clé Gemini est invalide ou non autorisée. Vérifiez GEMINI_API_KEY sur le serveur.'
            );
        }

        if ($response->status() === 404) {
            throw new RuntimeException(
                'Le modèle Gemini configuré est indisponible. Vérifiez GEMINI_MODEL sur le serveur.'
            );
        }

        if ($response->status() === 400) {
            throw new RuntimeException(
                'Gemini a refusé la requête. Vérifiez la configuration du modèle puis réessayez.'
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

        $payload = $response->json();
        $description = $this->extractText($payload);

        if (mb_strlen($description) < 80) {
            if (data_get($payload, 'promptFeedback.blockReason')) {
                throw new RuntimeException(
                    'Gemini a refusé ce contenu. Modifiez certaines informations du bien puis réessayez.'
                );
            }

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
        return collect($response['candidates'] ?? [])
            ->flatMap(fn (array $candidate) => data_get($candidate, 'content.parts', []))
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

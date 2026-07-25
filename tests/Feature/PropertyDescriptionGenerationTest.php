<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PropertyDescriptionGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_generate_a_property_description_with_gemini(): void
    {
        config([
            'services.gemini.api_key' => 'test-gemini-key',
            'services.gemini.model' => 'gemini-3.5-flash-lite',
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent' => Http::response(
                $this->geminiResponse(
                    'Villa familiale à Gombe, cette propriété de 220 m² propose quatre chambres et trois salles de bain dans un cadre pensé pour la vie quotidienne. La piscine et le parking complètent une configuration généreuse, tandis que la cuisine et les six pièces permettent une organisation confortable. Proposée à 250 000 USD, cette maison meublée en bon état constitue une option cohérente pour une famille recherchant de beaux volumes au Centre-ville.'
                )
            ),
        ]);

        $user = User::factory()->create();
        $payload = $this->propertyPayload();

        $response = $this->actingAs($user)->postJson(
            route('description.ai.generate-description'),
            $payload
        );

        $response->assertOk()
            ->assertJsonStructure(['description']);

        $this->assertStringContainsString('Villa familiale', $response->json('description'));
        $this->assertStringContainsString('Gombe', $response->json('description'));

        Http::assertSent(function (Request $request) use ($payload) {
            $input = json_decode(
                $request['contents'][0]['parts'][0]['text'],
                true
            );

            return $request->url() === 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent'
                && $request->hasHeader('x-goog-api-key', 'test-gemini-key')
                && filled($request['systemInstruction']['parts'][0]['text'])
                && $request['generationConfig']['maxOutputTokens'] === 700
                && $request['generationConfig']['responseMimeType'] === 'text/plain'
                && $input['langue'] === 'français'
                && $input['donnees_propriete']['title'] === $payload['title']
                && $input['donnees_propriete']['swimming_pool'] === true
                && filled($input['identifiant_de_variation']);
        });
    }

    public function test_regeneration_sends_the_previous_text_and_requests_a_new_variation(): void
    {
        config([
            'services.gemini.api_key' => 'test-gemini-key',
            'services.gemini.model' => 'gemini-3.5-flash-lite',
        ]);

        $firstDescription = str_repeat(
            'Première version structurée autour des volumes et du confort familial. ',
            3
        );
        $secondDescription = str_repeat(
            'Nouvelle approche centrée sur la localisation et les usages du bien. ',
            3
        );

        Http::fakeSequence()
            ->push($this->geminiResponse($firstDescription))
            ->push($this->geminiResponse($secondDescription));

        $user = User::factory()->create();

        $firstResponse = $this->actingAs($user)->postJson(
            route('description.ai.generate-description'),
            $this->propertyPayload()
        );

        $secondResponse = $this->actingAs($user)->postJson(
            route('description.ai.generate-description'),
            [
                ...$this->propertyPayload(),
                'previous_description' => $firstResponse->json('description'),
            ]
        );

        $firstResponse->assertOk();
        $secondResponse->assertOk();
        $this->assertNotSame(
            $firstResponse->json('description'),
            $secondResponse->json('description')
        );

        $requests = Http::recorded();
        $firstInput = json_decode(
            $requests[0][0]['contents'][0]['parts'][0]['text'],
            true
        );
        $secondInput = json_decode(
            $requests[1][0]['contents'][0]['parts'][0]['text'],
            true
        );

        $this->assertNotSame(
            $firstInput['identifiant_de_variation'],
            $secondInput['identifiant_de_variation']
        );
        $this->assertSame(
            trim($firstDescription),
            $secondInput['description_precedente_a_eviter']
        );
    }

    public function test_generation_fails_clearly_when_gemini_is_not_configured(): void
    {
        config(['services.gemini.api_key' => null]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(
                route('description.ai.generate-description'),
                $this->propertyPayload()
            )
            ->assertStatus(503)
            ->assertJson([
                'error' => 'Le service de génération IA n’est pas encore configuré.',
            ]);

        Http::assertNothingSent();
    }

    public function test_generation_reports_when_the_free_gemini_quota_is_exhausted(): void
    {
        config(['services.gemini.api_key' => 'test-gemini-key']);

        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/*' => Http::response(
                ['error' => ['status' => 'RESOURCE_EXHAUSTED']],
                429
            ),
        ]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(
                route('description.ai.generate-description'),
                $this->propertyPayload()
            )
            ->assertStatus(503)
            ->assertJson([
                'error' => 'Le quota gratuit de génération IA est momentanément atteint. Veuillez réessayer plus tard.',
            ]);
    }

    public function test_generation_reports_an_invalid_gemini_key_clearly(): void
    {
        config(['services.gemini.api_key' => 'invalid-gemini-key']);

        Http::fake([
            'generativelanguage.googleapis.com/v1beta/models/*' => Http::response(
                ['error' => ['status' => 'PERMISSION_DENIED']],
                403
            ),
        ]);

        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(
                route('description.ai.generate-description'),
                $this->propertyPayload()
            )
            ->assertStatus(503)
            ->assertJson([
                'error' => 'La clé Gemini est invalide ou non autorisée. Vérifiez GEMINI_API_KEY sur le serveur.',
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function propertyPayload(): array
    {
        return [
            'title' => 'Villa familiale',
            'type' => 'maison',
            'sale_type' => 'sale',
            'municipality' => 'Gombe',
            'quarter' => 'Centre-ville',
            'price' => 250000,
            'surface' => 220,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'rooms' => 6,
            'kitchens' => 1,
            'condition' => 'good',
            'furnished' => true,
            'parking' => true,
            'swimming_pool' => true,
            'amenities' => ['Parking', 'Piscine'],
            'language' => 'fr',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function geminiResponse(string $description): array
    {
        return [
            'candidates' => [
                [
                    'content' => [
                        'role' => 'model',
                        'parts' => [
                            [
                                'text' => $description,
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}

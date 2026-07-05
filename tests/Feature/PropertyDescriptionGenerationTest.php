<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyDescriptionGenerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_generate_property_description(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(
            route('description.ai.generate-description'),
            [
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
                'amenities' => ['Parking', 'Piscine'],
            ]
        );

        $response->assertOk()
            ->assertJsonStructure(['description']);

        $this->assertStringContainsString(
            'Villa familiale',
            $response->json('description')
        );
        $this->assertStringContainsString(
            'Gombe',
            $response->json('description')
        );
    }
}

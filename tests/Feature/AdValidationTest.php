<?php

namespace Tests\Feature;

use App\Domains\Ads\Services\AdSchemaValidator;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AdValidationTest extends TestCase
{
    protected AdSchemaValidator $validator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->validator = new AdSchemaValidator();
    }

    public function test_it_validates_nullable_fields_correctly()
    {
        // Category 1 (House), Sale
        $data = [
            'category_id' => 1,
            'ad_type' => 'sale',
            'details' => [
                // Required fields
                'bedrooms' => 3,
                'bathrooms' => 2,
                'kitchens' => 1,
                
                // Optional fields sent as null (simulating frontend)
                'living_rooms' => null,
                'rooms' => null,
                'floors' => null,
                'year_built' => null,
                'condition' => null, // This was failing before
                'garage_size' => null,
                'garden' => true,
            ]
        ];

        try {
            $this->validator->validate($data, 'create');
            $this->assertTrue(true, 'Validation passed for nullable fields');
        } catch (ValidationException $e) {
            $this->fail('Validation failed for nullable fields: ' . json_encode($e->errors()));
        }
    }

    public function test_it_validates_valid_enum_values()
    {
        $data = [
            'category_id' => 1,
            'ad_type' => 'sale',
            'details' => [
                'bedrooms' => 3,
                'bathrooms' => 2,
                'kitchens' => 1,
                'condition' => 'new', // Valid enum
            ]
        ];

        try {
            $this->validator->validate($data, 'create');
            $this->assertTrue(true);
        } catch (ValidationException $e) {
            $this->fail('Validation failed for valid enum: ' . json_encode($e->errors()));
        }
    }

    public function test_it_fails_invalid_enum_values()
    {
        $data = [
            'category_id' => 1,
            'ad_type' => 'sale',
            'details' => [
                'bedrooms' => 3,
                'bathrooms' => 2,
                'kitchens' => 1,
                'condition' => 'invalid_condition', // Invalid
            ]
        ];

        try {
            $this->validator->validate($data, 'create');
            $this->fail('Validation should have failed for invalid enum');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('details.condition', $e->errors());
        }
    }

    public function test_apartment_rent_allows_year_built_and_total_floors()
    {
        $data = [
            'category_id' => 2, // Apartment
            'ad_type' => 'rent',
            'details' => [
                'bedrooms' => 1,
                // Optional fields
                'year_built' => 2020,
                'total_floors' => 5,
            ]
        ];

        try {
            $this->validator->validate($data, 'create');
            $this->assertTrue(true);
        } catch (ValidationException $e) {
            $this->fail('Validation failed for apartment rent fields: ' . json_encode($e->errors()));
        }
    }
}

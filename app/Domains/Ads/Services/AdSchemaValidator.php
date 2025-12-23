<?php

namespace App\Domains\Ads\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdSchemaValidator
{
    protected array $schema;

    public function __construct()
    {
        $this->schema = config('ads_schema');
    }

    /**
     * @param array $data
     * @param string $mode create|update
     */
    public function validate(array $data, string $mode = 'create'): void
    {
        if (!isset($data['category_id'], $data['ad_type'], $data['details'])) {
            throw ValidationException::withMessages([
                'details' => ['Missing category_id, ad_type or details'],
            ]);
        }

        $categoryId = $data['category_id'];
        $adType = $data['ad_type'];
        $details = $data['details'];

        if (
            !isset($this->schema[$categoryId]) ||
            !isset($this->schema[$categoryId][$adType])
        ) {
            throw ValidationException::withMessages([
                'details' => ['No schema defined for this category and ad type'],
            ]);
        }

        $schema = $this->schema[$categoryId][$adType];
        $required = $schema['required'] ?? [];
        $optional = $schema['optional'] ?? [];

        $allowedFields = array_merge(
            array_keys($required),
            array_keys($optional)
        );

        /*
        |--------------------------------------------------
        | 1. Unknown fields
        |--------------------------------------------------
        */
        foreach ($details as $field => $value) {
            if (!in_array($field, $allowedFields, true)) {
                throw ValidationException::withMessages([
                    "details.$field" => ["Unknown field: $field"],
                ]);
            }
        }

        /*
        |--------------------------------------------------
        | 2. REQUIRED FIELDS — ONLY ON CREATE
        |--------------------------------------------------
        */
        if ($mode === 'create') {
            foreach ($required as $field => $rule) {
                if (!array_key_exists($field, $details)) {
                    throw ValidationException::withMessages([
                        "details.$field" => ["Field $field is required"],
                    ]);
                }
            }
        }

        /*
        |--------------------------------------------------
        | 3. Laravel validation rules
        |--------------------------------------------------
        */
        $rules = [];

        foreach ($details as $field => $value) {
            if (isset($required[$field])) {
                $rules["details.$field"] = $this->normalizeRule($required[$field]);
            } elseif (isset($optional[$field])) {
                $rules["details.$field"] = $this->normalizeRule($optional[$field]);
            }
        }

        $validator = Validator::make(['details' => $details], $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    protected function normalizeRule($rule): string
    {
        if (is_array($rule)) {
            return 'in:' . implode(',', $rule);
        }

        return $rule;
    }
}

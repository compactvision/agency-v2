<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 1 → MAISON
    |--------------------------------------------------------------------------
    */
    1 => [

        /* ======================= SALE ======================= */
        'sale' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
                'bathrooms' => 'integer|min:0',
                'kitchens' => 'integer|min:0',
            ],
            'optional' => [
                'living_rooms' => 'integer|min:0',
                'floors' => 'integer|min:1',
                'year_built' => 'integer|min:1800',
                'furnished' => 'boolean',
                'plot_surface' => 'numeric|min:0',
                'built_surface' => 'numeric|min:0',
                'condition' => ['new', 'good', 'to_renovate'],
            ],
        ],

        /* ======================= RENT ======================= */
        'rent' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
            ],
            'optional' => [
                'bathrooms' => 'integer|min:0',
                'kitchens' => 'integer|min:0',
                'living_rooms' => 'integer|min:0',
                'floors' => 'integer|min:1',
                'furnished' => 'boolean',
                'guarantee_months' => 'integer|min:0',
                'lease_duration_months' => 'integer|min:1',
                'available_from' => 'date',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 2 → APPARTEMENT
    |--------------------------------------------------------------------------
    */
    2 => [

        'sale' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
                'bathrooms' => 'integer|min:0',
                'kitchens' => 'integer|min:0',
                'floor' => 'integer|min:0',
            ],
            'optional' => [
                'living_rooms' => 'integer|min:0',
                'total_floors' => 'integer|min:1',
                'furnished' => 'boolean',
                'year_built' => 'integer|min:1800',
                'condition' => ['new', 'good', 'to_renovate'],
            ],
        ],

        'rent' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
            ],
            'optional' => [
                'bathrooms' => 'integer|min:0',
                'kitchens' => 'integer|min:0',
                'floor' => 'integer|min:0',
                'furnished' => 'boolean',
                'guarantee_months' => 'integer|min:0',
                'lease_duration_months' => 'integer|min:1',
                'available_from' => 'date',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 3 → TERRAIN
    |--------------------------------------------------------------------------
    */
    3 => [

        'sale' => [
            'required' => [
                'land_type' => ['constructible', 'agricole', 'industriel', 'viabilisé'],
            ],
            'optional' => [
                'title_deed' => 'boolean',
                'zoning' => 'string',
                'surface_unit' => ['m2', 'hectare'],
                'access_road' => 'boolean',
                'slope' => ['flat', 'slight', 'steep'],
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'lease_duration_months' => 'integer|min:1',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 4 → IMMEUBLE
    |--------------------------------------------------------------------------
    */
    4 => [

        'sale' => [
            'required' => [
                'floors' => 'integer|min:1',
                'apartments' => 'integer|min:1',
            ],
            'optional' => [
                'shops' => 'integer|min:0',
                'offices' => 'integer|min:0',
                'year_built' => 'integer|min:1800',
                'total_surface' => 'numeric|min:0',
                'monthly_income' => 'numeric|min:0',
                'condition' => ['new', 'good', 'to_renovate'],
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'lease_duration_months' => 'integer|min:1',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 5 → BUREAU
    |--------------------------------------------------------------------------
    */
    5 => [

        'sale' => [
            'required' => [],
            'optional' => [
                'rooms' => 'integer|min:0',
                'meeting_rooms' => 'integer|min:0',
                'floor' => 'integer|min:0',
                'total_floors' => 'integer|min:1',
                'surface_working' => 'numeric|min:0',
                'condition' => ['new', 'good', 'to_renovate'],
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'rooms' => 'integer|min:0',
                'meeting_rooms' => 'integer|min:0',
                'floor' => 'integer|min:0',
                'surface_working' => 'numeric|min:0',
                'guarantee_months' => 'integer|min:0',
                'lease_duration_months' => 'integer|min:1',
                'available_from' => 'date',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CATEGORY ID = 6 → ENTREPÔT
    |--------------------------------------------------------------------------
    */
    6 => [

        'sale' => [
            'required' => [],
            'optional' => [
                'height_meters' => 'numeric|min:0',
                'storage_surface' => 'numeric|min:0',
                'office_space' => 'boolean',
                'loading_docks' => 'integer|min:0',
                'access_trucks' => 'boolean',
                'condition' => ['new', 'good', 'to_renovate'],
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'height_meters' => 'numeric|min:0',
                'storage_surface' => 'numeric|min:0',
                'office_space' => 'boolean',
                'loading_docks' => 'integer|min:0',
                'lease_duration_months' => 'integer|min:1',
                'available_from' => 'date',
            ],
        ],
    ],
];

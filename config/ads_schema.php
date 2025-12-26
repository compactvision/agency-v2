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
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'living_rooms' => 'nullable|integer|min:0',
                'rooms' => 'nullable|integer|min:0',
                'floors' => 'nullable|integer|min:1',
                'year_built' => 'nullable|integer|min:1800',
                'construction_year' => 'nullable|integer|min:1800',
                'renovation_year' => 'nullable|integer|min:1800',
                'furnished' => 'nullable|boolean',
                'floor' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'plot_surface' => 'nullable|numeric|min:0',
                'built_surface' => 'nullable|numeric|min:0',
                'garage_size' => 'nullable|numeric|min:0',
                'elevator' => 'nullable|boolean',
                'parking' => 'nullable|boolean',
                'garden' => 'nullable|boolean',
                'swimming_pool' => 'nullable|boolean',
                'cellar' => 'nullable|boolean',
                'attic' => 'nullable|boolean',
                'condition' => 'nullable|in:new,good,to_renovate,old,renovated,renovation_needed',
            ],
        ],

        /* ======================= RENT ======================= */
        'rent' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
            ],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'bathrooms' => 'nullable|integer|min:0',
                'kitchens' => 'nullable|integer|min:0',
                'living_rooms' => 'nullable|integer|min:0',
                'rooms' => 'nullable|integer|min:0',
                'floors' => 'nullable|integer|min:1',
                'furnished' => 'nullable|boolean',
                'guarantee_months' => 'nullable|integer|min:0',
                'lease_duration_months' => 'nullable|integer|min:1',
                'available_from' => 'nullable|date',
                'construction_year' => 'nullable|integer|min:1800',
                'renovation_year' => 'nullable|integer|min:1800',
                'garage_size' => 'nullable|numeric|min:0',
                'elevator' => 'nullable|boolean',
                'parking' => 'nullable|boolean',
                'garden' => 'nullable|boolean',
                'swimming_pool' => 'nullable|boolean',
                'cellar' => 'nullable|boolean',
                'attic' => 'nullable|boolean',
                'condition' => 'nullable|in:new,good,to_renovate,old,renovated,renovation_needed',
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
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'living_rooms' => 'nullable|integer|min:0',
                'rooms' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'furnished' => 'nullable|boolean',
                'year_built' => 'nullable|integer|min:1800',
                'construction_year' => 'nullable|integer|min:1800',
                'renovation_year' => 'nullable|integer|min:1800',
                'garage_size' => 'nullable|numeric|min:0',
                'elevator' => 'nullable|boolean',
                'parking' => 'nullable|boolean',
                'garden' => 'nullable|boolean',
                'swimming_pool' => 'nullable|boolean',
                'cellar' => 'nullable|boolean',
                'attic' => 'nullable|boolean',
                'condition' => 'nullable|in:new,good,to_renovate,old,renovated,renovation_needed',
            ],
        ],

        'rent' => [
            'required' => [
                'bedrooms' => 'integer|min:0',
            ],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'bathrooms' => 'nullable|integer|min:0',
                'kitchens' => 'nullable|integer|min:0',
                'floor' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'rooms' => 'nullable|integer|min:0',
                'furnished' => 'nullable|boolean',
                'guarantee_months' => 'nullable|integer|min:0',
                'lease_duration_months' => 'nullable|integer|min:1',
                'available_from' => 'nullable|date',
                'year_built' => 'nullable|integer|min:1800',
                'construction_year' => 'nullable|integer|min:1800',
                'renovation_year' => 'nullable|integer|min:1800',
                'garage_size' => 'nullable|numeric|min:0',
                'elevator' => 'nullable|boolean',
                'parking' => 'nullable|boolean',
                'garden' => 'nullable|boolean',
                'swimming_pool' => 'nullable|boolean',
                'cellar' => 'nullable|boolean',
                'attic' => 'nullable|boolean',
                'condition' => 'nullable|in:new,good,to_renovate,old,renovated,renovation_needed',
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
                'land_type' => 'in:constructible,agricole,industriel,viabilisé',
            ],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'title_deed' => 'nullable|boolean',
                'zoning' => 'nullable|string',
                'surface_unit' => 'nullable|in:m2,hectare',
                'access_road' => 'nullable|boolean',
                'slope' => 'nullable|in:flat,slight,steep',
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'lease_duration_months' => 'nullable|integer|min:1',
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
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'shops' => 'nullable|integer|min:0',
                'offices' => 'nullable|integer|min:0',
                'year_built' => 'nullable|integer|min:1800',
                'total_surface' => 'nullable|numeric|min:0',
                'monthly_income' => 'nullable|numeric|min:0',
                'condition' => 'nullable|in:new,good,to_renovate',
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'lease_duration_months' => 'nullable|integer|min:1',
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
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'rooms' => 'nullable|integer|min:0',
                'meeting_rooms' => 'nullable|integer|min:0',
                'floor' => 'nullable|integer|min:0',
                'total_floors' => 'nullable|integer|min:1',
                'surface_working' => 'nullable|numeric|min:0',
                'condition' => 'nullable|in:new,good,to_renovate',
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'rooms' => 'nullable|integer|min:0',
                'meeting_rooms' => 'nullable|integer|min:0',
                'floor' => 'nullable|integer|min:0',
                'surface_working' => 'nullable|numeric|min:0',
                'guarantee_months' => 'nullable|integer|min:0',
                'lease_duration_months' => 'nullable|integer|min:1',
                'available_from' => 'nullable|date',
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
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'height_meters' => 'nullable|numeric|min:0',
                'storage_surface' => 'nullable|numeric|min:0',
                'office_space' => 'nullable|boolean',
                'loading_docks' => 'nullable|integer|min:0',
                'access_trucks' => 'nullable|boolean',
                'condition' => 'nullable|in:new,good,to_renovate',
            ],
        ],

        'rent' => [
            'required' => [],
            'optional' => [
                'quarter' => 'nullable|string',
                'address' => 'nullable|string',
                'height_meters' => 'nullable|numeric|min:0',
                'storage_surface' => 'nullable|numeric|min:0',
                'office_space' => 'nullable|boolean',
                'loading_docks' => 'nullable|integer|min:0',
                'lease_duration_months' => 'nullable|integer|min:1',
                'available_from' => 'nullable|date',
            ],
        ],
    ],
];

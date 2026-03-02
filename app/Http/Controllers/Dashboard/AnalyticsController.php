<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AnalyticsController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/analytics/Index', [
            'viewsPerDay' => [],
            'contactsPerMethod' => [],
            'mostViewedProperties' => [],
            'userStats' => [
                'sellers' => User::role('seller')->count(),
                'agencies' => 0, // Placeholder for now
                'buyers' => User::role('buyer')->count(),
            ],
            'propertyStats' => [
                'total' => 0,
                'published' => 0,
                'approved' => 0,
                'featured' => 0,
            ],
            'subscriptionStats' => [
                'active' => 0,
                'expired' => 0,
                'total' => 0,
            ],
            'paymentRequestStats' => [
                'pending' => 0,
                'approved' => 0,
                'rejected' => 0,
            ],
            'isAdmin' => auth()->user()->hasRole(['admin', 'super-admin']),
        ]);
    }

    public function show($id)
    {
        return Inertia::render('dashboard/analytics/Show', [
            'id' => $id
        ]);
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $isAdmin = $request->user()->hasRole(['admin', 'super-admin']);

        return Inertia::render('dashboard/analytics/Index', [
            'viewsPerDay' => [],
            'contactsPerMethod' => [],
            'mostViewedProperties' => [],
            'userStats' => $isAdmin ? [
                'sellers' => User::role('seller')->count(),
                'agencies' => 0, // Placeholder for now
                'buyers' => User::role('buyer')->count(),
            ] : ['sellers' => 0, 'agencies' => 0, 'buyers' => 0],
            'propertyStats' => $isAdmin ? [
                'total' => 0,
                'published' => 0,
                'approved' => 0,
                'featured' => 0,
            ] : ['total' => 0, 'published' => 0, 'approved' => 0, 'featured' => 0],
            'subscriptionStats' => $isAdmin ? [
                'active' => 0,
                'expired' => 0,
                'total' => 0,
            ] : ['active' => 0, 'expired' => 0, 'total' => 0],
            'paymentRequestStats' => $isAdmin ? [
                'pending' => 0,
                'approved' => 0,
                'rejected' => 0,
            ] : ['pending' => 0, 'approved' => 0, 'rejected' => 0],
            'isAdmin' => $isAdmin,
        ]);
    }

    public function show($id, Request $request)
    {
        $property = \App\Domains\Ads\Models\Ad::findOrFail($id);

        // Check if user is admin OR the owner of the property
        if (!$request->user()->hasRole(['admin', 'super-admin']) && $property->user_id !== $request->user()->id) {
            abort(403, 'You are not authorized to view statistics for this property.');
        }

        return Inertia::render('dashboard/analytics/Show', [
            'id' => $id,
            'propertyTitle' => $property->title,
            'views' => [
                'total' => 0,
                'first' => '-',
                'last' => '-',
                'chart' => [],
                'topViewers' => [],
                'data' => []
            ],
            'contacts' => [
                'total' => 0,
                'chart' => [],
                'byMethod' => [],
                'data' => []
            ]
        ]);
    }
}

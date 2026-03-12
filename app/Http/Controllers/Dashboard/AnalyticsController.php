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
        $isAdmin = auth()->user()->hasRole(['admin', 'super-admin']);

        return Inertia::render('dashboard/analytics/Index', [
            'viewsPerDay' => [],
            'contactsPerMethod' => [],
            'mostViewedProperties' => [],
            'userStats' => $isAdmin ? [
                'sellers' => User::role('seller')->count(),
                'agencies' => 0, // Placeholder for now
                'buyers' => User::role('buyer')->count(),
            ] : null,
            'propertyStats' => $isAdmin ? [
                'total' => 0,
                'published' => 0,
                'approved' => 0,
                'featured' => 0,
            ] : null,
            'subscriptionStats' => $isAdmin ? [
                'active' => 0,
                'expired' => 0,
                'total' => 0,
            ] : null,
            'paymentRequestStats' => $isAdmin ? [
                'pending' => 0,
                'approved' => 0,
                'rejected' => 0,
            ] : null,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function show($id)
    {
        return Inertia::render('dashboard/analytics/Show', [
            'id' => $id
        ]);
    }
}

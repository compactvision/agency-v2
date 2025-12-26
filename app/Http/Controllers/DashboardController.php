<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
// Assuming some models exist or using dummy data for placeholder pages
// In a real scenario, these would fetch from respective domains

class DashboardController extends Controller
{
    /**
     * Dashboard Home / Overview
     */
    public function index()
    {
        return Inertia::render('dashboard/Index', [
            'properties' => [],
            'logs' => [],
            'metrics' => [
                'properties' => ['total' => 0, 'unapproved' => 0],
                'views' => ['total' => 0],
                'favorites' => ['total' => 0],
            ]
        ]);
    }

    /**
     * Properties Management
     */
    public function properties()
    {
        return Inertia::render('dashboard/properties/Properties', [
            'properties' => []
        ]);
    }

    public function createProperty()
    {
        return Inertia::render('dashboard/properties/EditProperties', [
            'countries' => [],
            'municipalities' => [],
            'amenities' => [],
            'hasActiveSubscription' => true,
        ]);
    }

    public function editProperty($id)
    {
        return Inertia::render('dashboard/properties/EditProperties', [
            'countries' => [],
            'municipalities' => [],
            'amenities' => [],
            'hasActiveSubscription' => true,
            'property' => null // Fetch property by ID here
        ]);
    }

    public function favorites()
    {
        return Inertia::render('dashboard/properties/FavoriteProperties');
    }

    /**
     * User Management
     */
    public function users()
    {
        return Inertia::render('dashboard/users/User', [
            'users' => []
        ]);
    }

    public function profile()
    {
        return Inertia::render('dashboard/profile/Profile', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Administration
     */
    public function roles()
    {
        return Inertia::render('dashboard/roles/Roles');
    }

    public function municipalities()
    {
        return Inertia::render('dashboard/municipalities/Municipalities');
    }

    public function plans()
    {
        return Inertia::render('dashboard/plans/Tarifs');
    }

    public function pages()
    {
        return Inertia::render('dashboard/pages/Pages');
    }

    public function editPage($id)
    {
        return Inertia::render('dashboard/pages/PageEditor', [
            'id' => $id
        ]);
    }

    public function transactions()
    {
        return Inertia::render('dashboard/transactions/Transactions', [
            'paymentRequests' => [
                'data' => [],
                'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 0],
                'links' => []
            ],
        ]);
    }

    public function auditLogs()
    {
        return Inertia::render('dashboard/auditLog/AuditLog', [
            'logs' => [
                'data' => [],
                'links' => [],
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0,
            ],
        ]);
    }

    public function chatbotLogs()
    {
        return Inertia::render('dashboard/ChatbotLogs/ChatbotLogs', [
            'logs' => [
                'data' => [],
                'links' => [],
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0,
            ],
        ]);
    }

    /**
     * Settings & Others
     */
    public function settings()
    {
        return Inertia::render('dashboard/settings/Settings', [
            'user' => auth()->user(),
            'settings' => [],
            'userRoles' => auth()->user()->roles->pluck('name')->toArray(),
        ]);
    }

    public function subscriptions()
    {
        return Inertia::render('dashboard/subscriptions/Package', [
            'subscriptions' => [
                'data' => [],
                'meta' => ['current_page' => 1, 'last_page' => 1, 'total' => 0],
                'links' => []
            ],
            'hasActiveSubscription' => false,
            'currentPlan' => null,
            'plans' => [],
            'filters' => ['search' => ''],
        ]);
    }

    public function analytics()
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

    public function showAnalytics($id)
    {
        return Inertia::render('dashboard/analytics/Show', [
            'id' => $id
        ]);
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            ],
            'recentNotifications' => auth()->user()->notifications()->take(5)->get(),
        ]);
    }
}

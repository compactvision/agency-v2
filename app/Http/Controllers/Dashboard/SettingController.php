<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/settings/Settings', [
            'user' => auth()->user(),
            'settings' => [],
            'userRoles' => auth()->user()->roles->pluck('name')->toArray(),
        ]);
    }
}

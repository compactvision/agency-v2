<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Domains\Billing\Models\Plan;

class PageController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
            'properties' => [],
            'municipalities' => [],
            'favorites' => []
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function tarifs(Request $request)
    {
        $plans = Plan::with('features')
            ->where('is_active', true)
            ->orderBy('position')
            ->get();

        return Inertia::render('Tarifs', [
            'plans' => $plans,
            'currentPlanId' => $request->user()?->subscription?->plan_id
        ]);
    }

    public function faq()
    {
        return Inertia::render('Faq');
    }

    public function properties()
    {
        return Inertia::render('properties/Properties');
    }

    public function language(Request $request)
    {
        $request->validate(['language' => 'required|string|in:en,fr']);
        
        session(['locale' => $request->language]);
        app()->setLocale($request->language);

        return back();
    }
}

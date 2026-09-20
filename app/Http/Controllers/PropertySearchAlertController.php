<?php

namespace App\Http\Controllers;

use App\Models\PropertySearchAlert;
use Illuminate\Http\Request;

class PropertySearchAlertController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'municipality_id' => ['required', 'integer', 'exists:municipalities,id'],
        ]);
        $alert = PropertySearchAlert::firstOrCreate([
            'user_id' => $request->user()->id,
            'municipality_id' => $data['municipality_id'],
        ], ['subscribed_at' => now()->format('Y-m-d H:i:s.u')]);

        if (! $alert->active) {
            $alert->update(['active' => true, 'subscribed_at' => now()->format('Y-m-d H:i:s.u')]);
        }

        return response()->json(['message' => __('search-alerts.enabled')]);
    }

    public function unsubscribe(PropertySearchAlert $alert)
    {
        return view('search-alerts.unsubscribe', ['alert' => $alert, 'done' => false]);
    }

    public function destroy(PropertySearchAlert $alert)
    {
        $alert->update(['active' => false]);

        return view('search-alerts.unsubscribe', ['alert' => $alert, 'done' => true]);
    }
}

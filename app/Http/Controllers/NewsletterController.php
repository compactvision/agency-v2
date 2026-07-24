<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewsletterController extends Controller
{
    /**
     * Subscribe to the newsletter.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        NewsletterSubscription::updateOrCreate(
            ['email' => $request->email],
            [
                'user_id' => Auth::id(),
                'is_active' => true,
            ]
        );

        return back()->with('success', __('newsletter_subscribed_success') ?: 'Si cette adresse est valide, son inscription est prise en compte.');
    }
}

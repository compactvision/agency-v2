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
            'email' => ['required', 'email', 'max:255', 'unique:newsletter_subscriptions,email'],
        ], [
            'email.unique' => __('newsletter_already_subscribed') ?: 'Cet email est déjà inscrit à notre newsletter.',
        ]);

        NewsletterSubscription::updateOrCreate(
            ['email' => $request->email],
            [
                'user_id' => Auth::id(),
                'is_active' => true,
            ]
        );

        return back()->with('success', __('newsletter_subscribed_success') ?: 'Vous êtes désormais inscrit à la newsletter !');
    }
}

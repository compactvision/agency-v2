<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use App\Services\BrevoNewsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * Subscribe to the newsletter.
     */
    public function subscribe(Request $request, BrevoNewsletter $brevo)
    {
        if (is_string($request->input('email'))) {
            $request->merge(['email' => mb_strtolower(trim($request->input('email')))]);
        }
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $brevo->subscribe($request->email);

        $values = ['is_active' => true];
        if ($request->user() && strcasecmp($request->user()->email, $request->email) === 0) {
            $values['user_id'] = $request->user()->id;
        }

        $subscription = NewsletterSubscription::updateOrCreate(
            ['email' => $request->email],
            $values
        );

        $brevo->sendWelcome($subscription);

        return back()->with('success', 'Votre inscription à la newsletter a bien été prise en compte.');
    }
}

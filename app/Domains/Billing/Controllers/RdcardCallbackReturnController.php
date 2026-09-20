<?php

namespace App\Domains\Billing\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RdcardCallbackReturnController
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate(['transaction' => ['nullable', 'string', 'max:255']]);

        // Older checkout sessions have no transaction in their callback URL.
        // Never guess which attempt to cancel, especially with several tabs open.
        if (empty($validated['transaction'])) {
            return redirect()->route('dashboard.subscriptions.index');
        }

        // The regular return checks ownership and fetches the status from RDCard.
        // Visiting the callback alone is not proof of cancellation or success.
        return redirect()->route('billing.return', ['transaction' => $validated['transaction']]);
    }
}

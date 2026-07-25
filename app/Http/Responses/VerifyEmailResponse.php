<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();
        $request->session()->flash('success', 'Adresse e-mail vérifiée avec succès.');

        if ($user && $user->hasRole('buyer')) {
            return redirect('/profile?verified=1');
        }

        return redirect(Fortify::redirects('email-verification', '/dashboard').'?verified=1');
    }
}

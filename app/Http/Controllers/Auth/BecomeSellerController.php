<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Domains\Auth\Requests\BecomeSellerRequest;
use App\Domains\Auth\Services\AuthService;
use Illuminate\Support\Facades\Redirect;

class BecomeSellerController extends Controller
{
    public function __construct(
        protected AuthService $service
    ) {}

    public function __invoke(BecomeSellerRequest $request)
    {
        $result = $this->service->becomeSeller($request->user(), $request->validated());

        if ($result === "NO_CHANGES") {
            return Redirect::back()->with('message', 'Aucune modification détectée.');
        }

        return Redirect::to('/dashboard')->with('message', 'Votre profil a été mis à jour avec succès. Vous êtes maintenant un vendeur !');
    }
}

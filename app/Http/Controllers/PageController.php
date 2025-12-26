<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

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

    public function tarifs()
    {
        return Inertia::render('Tarifs');
    }

    public function faq()
    {
        return Inertia::render('Faq');
    }

    public function properties()
    {
        return Inertia::render('properties/Properties');
    }
}

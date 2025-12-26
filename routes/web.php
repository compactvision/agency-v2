<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\PageController;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::get('/tarifs', [PageController::class, 'tarifs'])->name('tarifs');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/properties', [PageController::class, 'properties'])->name('properties');
Route::get('/property/{slug}', [PageController::class, 'property'])->name('property.show');
Route::get('pages/{slug}', [PageController::class, 'page'])->name('pages.show');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';

Route::prefix('/dashboard')->name('dashboard.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/Index');
    })->name('index'); 
});



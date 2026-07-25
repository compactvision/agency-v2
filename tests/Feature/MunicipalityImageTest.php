<?php

use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

function municipalityImageAdmin(): User
{
    Role::findOrCreate('admin', 'web');

    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('admin');

    return $admin;
}

function municipalityImageCity(): City
{
    $country = Country::create([
        'name' => 'République démocratique du Congo',
        'iso_code' => 'COD',
    ]);

    return City::create([
        'country_id' => $country->id,
        'name' => 'Kinshasa',
    ]);
}

test('an administrator can create a municipality with an image', function () {
    Storage::fake('public');

    $city = municipalityImageCity();

    $this->actingAs(municipalityImageAdmin())
        ->post(route('dashboard.municipalities.store'), [
            'name' => 'Gombe',
            'city_id' => $city->id,
            'image' => UploadedFile::fake()->image('gombe.jpg', 1200, 800),
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $municipality = Municipality::where('name', 'Gombe')->firstOrFail();

    expect($municipality->image)->not->toBeNull()
        ->and($municipality->image_url)->toContain('/storage/municipalities/');

    Storage::disk('public')->assertExists($municipality->image);
});

test('replacing or removing a municipality image cleans up the previous file', function () {
    Storage::fake('public');

    $city = municipalityImageCity();
    $oldImage = UploadedFile::fake()
        ->image('old.jpg')
        ->store('municipalities', 'public');
    $municipality = Municipality::create([
        'name' => 'Ngaliema',
        'city_id' => $city->id,
        'image' => $oldImage,
    ]);

    $admin = municipalityImageAdmin();
    $this->actingAs($admin)
        ->post(route('dashboard.municipalities.update', $municipality), [
            '_method' => 'put',
            'name' => 'Ngaliema',
            'city_id' => $city->id,
            'image' => UploadedFile::fake()->image('new.webp'),
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $newImage = $municipality->fresh()->image;

    expect($newImage)->not->toBe($oldImage);
    Storage::disk('public')->assertMissing($oldImage);
    Storage::disk('public')->assertExists($newImage);

    $this->actingAs($admin)
        ->post(route('dashboard.municipalities.update', $municipality), [
            '_method' => 'put',
            'name' => 'Ngaliema',
            'city_id' => $city->id,
            'remove_image' => true,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($municipality->fresh()->image)->toBeNull();
    Storage::disk('public')->assertMissing($newImage);
});

test('deleting a municipality also deletes its image', function () {
    Storage::fake('public');

    $city = municipalityImageCity();
    $image = UploadedFile::fake()
        ->image('limete.png')
        ->store('municipalities', 'public');
    $municipality = Municipality::create([
        'name' => 'Limete',
        'city_id' => $city->id,
        'image' => $image,
    ]);

    $this->actingAs(municipalityImageAdmin())
        ->delete(route('dashboard.municipalities.destroy', $municipality))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('municipalities', ['id' => $municipality->id]);
    Storage::disk('public')->assertMissing($image);
});

test('the municipality screen exposes system countries and their cities', function () {
    $city = municipalityImageCity();
    Municipality::create([
        'name' => 'Bandalungwa',
        'city_id' => $city->id,
    ]);

    $this->actingAs(municipalityImageAdmin())
        ->get(route('dashboard.municipalities.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/municipalities/Municipalities')
            ->has('countries', 1)
            ->where('countries.0.name', 'République démocratique du Congo')
            ->where('countries.0.iso_code', 'COD')
            ->has('cities', 1)
            ->where('cities.0.name', 'Kinshasa')
            ->where('cities.0.country_id', $city->country_id)
            ->where('municipalities.data.0.country', 'République démocratique du Congo')
            ->where('municipalities.data.0.city', 'Kinshasa'));
});

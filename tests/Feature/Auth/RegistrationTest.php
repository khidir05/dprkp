<?php

use App\Models\Role;
use App\Models\RegistrationLink;
use Illuminate\Support\Str;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered with valid token', function () {
    $role = Role::first() ?? Role::create([
        'code' => 'pemohon',
        'nama' => 'Pemohon',
        'label' => 'PM',
    ]);

    $link = RegistrationLink::create([
        'token' => (string) Str::uuid(),
        'role_id' => $role->id,
        'is_used' => false,
        'expires_at' => now()->addDay(),
    ]);

    $response = $this->get(route('register', ['token' => $link->token]));

    $response->assertOk();
});

test('new users can register with valid token', function () {
    $role = Role::first() ?? Role::create([
        'code' => 'pemohon',
        'nama' => 'Pemohon',
        'label' => 'PM',
    ]);

    $link = RegistrationLink::create([
        'token' => (string) Str::uuid(),
        'role_id' => $role->id,
        'is_used' => false,
        'expires_at' => now()->addDay(),
    ]);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'phone' => '08123456789',
        'password' => 'password',
        'password_confirmation' => 'password',
        'token' => $link->token,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
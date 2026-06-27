<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'username' => ['required', 'string', 'alpha_dash', 'max:255', 'unique:users,username'],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => $this->passwordRules(),
            'token' => [
                'required',
                function ($attribute, $value, $fail) {
                    $link = \App\Models\RegistrationLink::where('token', $value)
                        ->where('is_used', false)
                        ->where('expires_at', '>', now())
                        ->first();
                    if (! $link) {
                        $fail('Link pendaftaran tidak valid, sudah digunakan, atau kedaluwarsa.');
                    }
                }
            ],
        ], [
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah terdaftar.',
            'username.alpha_dash' => 'Username hanya boleh mengandung huruf, angka, strip, dan underscore.',
            'token.required' => 'Token pendaftaran wajib dilampirkan.',
        ])->validate();

        $link = \App\Models\RegistrationLink::with('role')->where('token', $input['token'])->first();
        $role = $link->role;

        // Generate code_user e.g., GD-002
        $count = User::where('role', $role->id)->count() + 1;
        $codeUser = $role->label . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $user = User::create([
            'role' => $role->id,
            'name' => $input['name'],
            'email' => $input['email'],
            'username' => $input['username'],
            'phone' => $input['phone'] ?? null,
            'password' => \Illuminate\Support\Facades\Hash::make($input['password']),
            'code_user' => $codeUser,
            'is_active' => true,
        ]);

        // Consume registration token
        $link->update(['is_used' => true]);

        return $user;
    }
}

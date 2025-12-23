<?php

namespace App\Domains\Auth\Controllers;

use App\Domains\Auth\Requests\LoginRequest;
use App\Domains\Auth\Requests\RegisterRequest;
use App\Domains\Auth\Requests\BecomeSellerRequest;
use App\Domains\Auth\Requests\ForgotPasswordRequest;
use App\Domains\Auth\Requests\ResetPasswordRequest;
use App\Domains\Auth\Requests\UpdateProfileRequest;
use App\Domains\Auth\Requests\ChangePasswordRequest;
use App\Domains\Auth\Services\AuthService;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController
{
    public function __construct(
        protected AuthService $service
    ) {
    }

    public function register(RegisterRequest $request)
    {
        try {
            return ApiResponse::success(
                $this->service->register($request->validated()),
                'User registered successfully',
                201
            );
        } catch (\Throwable $e) {
            if (app()->isLocal())
                throw $e;
            return ApiResponse::error('Internal server error', 500, 'REGISTER_ERROR');
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            return ApiResponse::success(
                $this->service->login($request->validated()),
                'Login successful'
            );
        } catch (ValidationException $e) {
            return ApiResponse::error('Invalid credentials', 422, 'INVALID_CREDENTIALS', $e->errors());
        } catch (\Throwable $e) {
            if (app()->isLocal())
                throw $e;
            return ApiResponse::error('Internal server error', 500, 'LOGIN_ERROR');
        }
    }

    public function me(Request $request)
    {
        return ApiResponse::success(
            $this->service->me($request->user()),
            'Current user retrieved'
        );
    }

    public function logout(Request $request)
    {
        $this->service->logout($request->user());
        return ApiResponse::success(null, 'Logged out successfully');
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $result = $this->service->updateProfile($request->user(), $request->validated());

        if ($result === "NO_CHANGES") {
            return ApiResponse::success(
                $request->user()->load(['country', 'city', 'municipality', 'roles']),
                "No changes detected"
            );
        }

        return ApiResponse::success($result, "Profile updated");
    }


    public function becomeSeller(BecomeSellerRequest $request)
    {
        $result = $this->service->becomeSeller($request->user(), $request->validated());

        if ($result === "NO_CHANGES") {
            return ApiResponse::success(
                $request->user()->load(['country', 'city', 'municipality', 'roles']),
                "No changes detected"
            );
        }

        return ApiResponse::success($result, "User upgraded to seller");
    }



    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $this->service->changePassword($request->user(), $request->validated());
            return ApiResponse::success(null, 'Password updated');
        } catch (ValidationException $e) {
            return ApiResponse::error('Current password incorrect', 422, 'INVALID_PASSWORD', $e->errors());
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? ApiResponse::success(null, 'Reset link sent')
            : ApiResponse::error('Unable to send reset link', 400);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->password = Hash::make($request->password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? ApiResponse::success(null, 'Password reset successfully')
            : ApiResponse::error('Invalid token', 400);
    }

    public function resendVerification(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return ApiResponse::success(null, 'Email already verified');
        }

        $request->user()->sendEmailVerificationNotification();
        return ApiResponse::success(null, 'Verification email sent');
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->id);

        if (!hash_equals((string) $request->hash, sha1($user->email))) {
            return ApiResponse::error('Invalid verification link', 400);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return ApiResponse::success(null, 'Email verified');
    }
}

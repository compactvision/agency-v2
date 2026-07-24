<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Domains\Ads\Models\Ad;
use App\Domains\Billing\Models\Subscription;
use App\Domains\Locations\Models\City;
use App\Domains\Locations\Models\Country;
use App\Domains\Locations\Models\Municipality;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasLocalePreference, MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'profile_photo',
        'country_id',
        'city_id',
        'municipality_id',
        'address',
        'bio',
        'company',
        'rc_number',
        'tax_number',
        'user_type',
        'is_seller',
        'language',
        'notifications_enabled',
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'anonymized_at' => 'datetime',
        ];
    }

    public function preferredLocale(): string
    {
        return in_array($this->language, ['fr', 'en'], true)
            ? $this->language
            : config('app.fallback_locale', 'fr');
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class)
            ->ofMany(['id' => 'max'], function ($query) {
                $query->where('status', 'active')
                    ->where(function ($expiry) {
                        $expiry->whereNull('expires_at')
                            ->orWhere('expires_at', '>', now());
                    });
            });
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function hasActiveSubscription(): bool
    {
        return $this->subscription()->exists();
    }

    public function favorites()
    {
        return $this->belongsToMany(Ad::class, 'favorites', 'user_id', 'ad_id')->withTimestamps();
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function newsletter_subscription()
    {
        return $this->hasOne(NewsletterSubscription::class);
    }

    public function ads()
    {
        return $this->hasMany(Ad::class);
    }
}

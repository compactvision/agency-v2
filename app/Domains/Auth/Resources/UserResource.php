<?php

namespace App\Domains\Auth\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'bio' => $this->bio,
            'company' => $this->company,
            'rc_number' => $this->rc_number,
            'tax_number' => $this->tax_number,
            'facebook' => $this->facebook,
            'twitter' => $this->twitter,
            'instagram' => $this->instagram,
            'linkedin' => $this->linkedin,
            'language' => $this->language,
            'notifications_enabled' => (bool) $this->notifications_enabled,
            'profile_photo' => $this->profile_photo,
            'profile_photo_url' => $this->profile_photo ? asset('storage/' . $this->profile_photo) : null,
            'total_properties_count' => $this->ads()->count(),
            'approved_properties_count' => $this->ads()->where('status', 'published')->count(),
            'pending_properties_count' => $this->ads()->where('status', 'pending_validation')->count(),
            'roles' => $this->roles->map(fn($role) => ['name' => $role->name]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    protected $fillable = [
        'item_id',
        'claimant_name',
        'contact',
        'proof',
        'image_paths',
        'claimant_token_hash',
        'status',
    ];

    protected $hidden = ['claimant_token_hash'];

    protected $appends = ['image_urls'];

    protected function casts(): array
    {
        return [
            'image_paths' => 'array',
        ];
    }

    protected function imageUrls(): Attribute
    {
        return Attribute::get(
            fn () => collect($this->image_paths ?? [])
                ->map(fn (string $path) => asset('storage/'.$path))
                ->values()
                ->all()
        );
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = [
        'user_id',
        'public_id',
        'reporter_name',
        'contact',
        'reporter_token_hash',
        'category_id',
        'type',
        'title',
        'keywords',
        'description',
        'location',
        'event_date',
        'image_path',
        'image_paths',
        'verification_question',
        'status',
        'status_before_resolution',
        'resolved_at',
        'resolved_by_name',
        'resolution_note',
    ];

    protected $hidden = ['reporter_token_hash'];

    protected $appends = ['image_url', 'image_urls'];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'image_paths' => 'array',
            'resolved_at' => 'datetime',
        ];
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->image_path ? asset('storage/'.$this->image_path) : null
        );
    }

    protected function imageUrls(): Attribute
    {
        return Attribute::get(
            fn () => collect($this->image_paths ?? ($this->image_path ? [$this->image_path] : []))
                ->map(fn (string $path) => asset('storage/'.$path))
                ->values()
                ->all()
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class)->latest();
    }
}

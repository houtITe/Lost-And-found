<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    protected $fillable = [
        'category_id',
        'type',
        'title',
        'description',
        'location',
        'event_date',
        'image_path',
        'verification_question',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->image_path ? asset('storage/'.$this->image_path) : null
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
}
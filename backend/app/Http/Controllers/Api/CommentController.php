<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Item $item): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:100'],
            'message' => ['nullable', 'string', 'max:2000', 'required_without:images'],
            'images' => ['nullable', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $paths = collect($request->file('images', []))
            ->filter()
            ->take(3)
            ->map(fn ($file) => $file->store('comments', 'public'))
            ->values()
            ->all();

        $comment = Comment::create([
            'item_id' => $item->id,
            'name' => $data['name'] ?? 'RUPP user',
            'message' => $data['message'] ?? null,
            'image_paths' => $paths,
        ]);

        return response()->json($comment, 201);
    }
}

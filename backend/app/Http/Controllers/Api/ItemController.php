<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'type' => ['nullable', 'in:lost,found'],
            'status' => ['nullable', 'in:open,claimed,returned'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $items = Item::query()
            ->with('category:id,name')
            ->withCount(['comments', 'claims'])
            ->when($filters['type'] ?? null, fn ($query, $value) => $query->where('type', $value))
            ->when($filters['status'] ?? null, fn ($query, $value) => $query->where('status', $value))
            ->when(
                $filters['category_id'] ?? null,
                fn ($query, $value) => $query->where('category_id', $value)
            )
            ->when($filters['search'] ?? null, function ($query, $term) {
                $query->where(function ($query) use ($term) {
                    $query
                        ->where('title', 'like', "%{$term}%")
                        ->orWhere('keywords', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%")
                        ->orWhere('location', 'like', "%{$term}%");
                });
            })
            ->latest()
            ->paginate($filters['per_page'] ?? 24)
            ->withQueryString();

        return response()->json($items);
    }

    public function show(Item $item): JsonResponse
    {
        $item->load([
            'category:id,name',
            'comments:id,item_id,name,message,image_paths,created_at',
        ]);

        return response()->json($item);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reporter_name' => ['required', 'string', 'max:100'],
            'contact' => ['required', 'string', 'max:80'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'type' => ['required', 'in:lost,found'],
            'title' => ['required', 'string', 'max:255'],
            'keywords' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:255'],
            'event_date' => ['nullable', 'date', 'before_or_equal:today'],
            'verification_question' => ['nullable', 'string', 'max:255'],
            'images' => ['nullable', 'array', 'max:6'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $files = $request->file('images', []);
        $files = is_array($files) ? $files : [$files];
        if ($request->hasFile('image')) {
            $files[] = $request->file('image');
        }

        $paths = collect($files)
            ->filter()
            ->take(6)
            ->map(fn ($file) => $file->store('items', 'public'))
            ->values()
            ->all();

        $manageToken = Str::random(48);
        $data['public_id'] = (string) Str::uuid();
        $data['user_id'] = $request->user()?->id;
        $data['reporter_token_hash'] = hash('sha256', $manageToken);
        $data['event_date'] = $data['event_date'] ?? now()->toDateString();
        $data['image_path'] = $paths[0] ?? null;
        $data['image_paths'] = $paths;
        unset($data['images'], $data['image']);

        $item = Item::create($data);
        $item->load('category:id,name');

        return response()->json([
            'item' => $item,
            'manage_token' => $manageToken,
        ], 201);
    }
}

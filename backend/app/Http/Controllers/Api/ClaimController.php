<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClaimController extends Controller
{
    public function store(Request $request, Item $item): JsonResponse
    {
        $data = $request->validate([
            'claimant_name' => ['required', 'string', 'max:100'],
            'contact' => ['required', 'string', 'max:80'],
            'proof' => ['required', 'string', 'max:2000'],
            'images' => ['nullable', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $paths = collect($request->file('images', []))
            ->filter()
            ->take(3)
            ->map(fn ($file) => $file->store('claims', 'public'))
            ->values()
            ->all();

        $claimantToken = Str::random(48);
        $claim = Claim::create([
            'item_id' => $item->id,
            'claimant_name' => $data['claimant_name'],
            'contact' => $data['contact'],
            'proof' => $data['proof'],
            'image_paths' => $paths,
            'claimant_token_hash' => hash('sha256', $claimantToken),
        ]);

        return response()->json([
            'claim' => $claim,
            'claimant_token' => $claimantToken,
            'message' => 'Your claim was sent for review.',
        ], 201);
    }

    public function index(Request $request, Item $item): JsonResponse
    {
        $this->authorizeReporter($request, $item);

        return response()->json($item->claims()->get());
    }

    public function updateStatus(Request $request, Item $item, Claim $claim): JsonResponse
    {
        $this->authorizeReporter($request, $item);

        abort_unless($claim->item_id === $item->id, 404);

        $data = $request->validate([
            'status' => ['required', 'in:accepted,rejected'],
        ]);

        $claim->update(['status' => $data['status']]);
        if ($data['status'] === 'accepted') {
            $item->update(['status' => 'claimed']);
        }

        return response()->json($claim->fresh());
    }

    private function authorizeReporter(Request $request, Item $item): void
    {
        $token = $request->header('X-Reporter-Token');
        abort_unless(
            $token && $item->reporter_token_hash && hash_equals(
                $item->reporter_token_hash,
                hash('sha256', $token)
            ),
            403,
            'A valid reporter token is required.'
        );
    }
}

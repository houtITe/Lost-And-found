<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GuestItemsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_create_and_read_a_report(): void
    {
        Storage::fake('public');
        $category = Category::create(['name' => 'Keys']);

        $response = $this->postJson('/api/items', [
            'reporter_name' => 'Sokha',
            'contact' => '012345678',
            'category_id' => $category->id,
            'type' => 'found',
            'title' => 'Motorbike key',
            'keywords' => 'key motorcycle',
            'description' => 'Found near the library entrance.',
            'location' => 'Library',
            'event_date' => now()->toDateString(),
            'images' => [UploadedFile::fake()->image('key.jpg')],
        ])->assertCreated();

        $response->assertJsonPath('item.title', 'Motorbike key');
        $response->assertJsonPath('item.contact', '012345678');
        $response->assertJsonStructure(['item' => ['public_id', 'image_urls'], 'manage_token']);
        $itemId = $response->json('item.id');

        $this->getJson('/api/items')->assertOk()->assertJsonPath('data.0.title', 'Motorbike key');
        $this->getJson("/api/items/{$itemId}")->assertOk()->assertJsonPath('title', 'Motorbike key');
    }

    public function test_guest_can_comment_and_submit_a_private_claim(): void
    {
        $category = Category::create(['name' => 'Student ID Card']);
        $create = $this->postJson('/api/items', [
            'reporter_name' => 'Dara',
            'contact' => '@rupp_finder',
            'category_id' => $category->id,
            'type' => 'found',
            'title' => 'Student ID card',
            'description' => 'Found at Building A.',
            'location' => 'Building A',
            'event_date' => now()->toDateString(),
        ])->assertCreated();

        $itemId = $create->json('item.id');
        $reporterToken = $create->json('manage_token');

        $this->postJson("/api/items/{$itemId}/comments", [
            'message' => 'I saw this item earlier.',
        ])->assertCreated();

        $claim = $this->postJson("/api/items/{$itemId}/claims", [
            'claimant_name' => 'Vannak',
            'contact' => '012999999',
            'proof' => 'The card has a blue sticker on the back.',
        ])->assertCreated();

        $claimId = $claim->json('claim.id');
        $this->withHeader('X-Reporter-Token', $reporterToken)
            ->getJson("/api/items/{$itemId}/claims")
            ->assertOk()
            ->assertJsonPath('0.id', $claimId);

        $this->withHeader('X-Reporter-Token', $reporterToken)
            ->patchJson("/api/items/{$itemId}/claims/{$claimId}", ['status' => 'accepted'])
            ->assertOk()
            ->assertJsonPath('status', 'accepted');
    }

    public function test_anyone_can_archive_a_report_and_only_the_reporter_can_restore_it(): void
    {
        $category = Category::create(['name' => 'Keys']);
        $create = $this->postJson('/api/items', [
            'reporter_name' => 'Sophea',
            'contact' => '012111222',
            'category_id' => $category->id,
            'type' => 'lost',
            'title' => 'Motorbike key',
            'description' => 'Lost near the north parking area.',
            'location' => 'North parking area',
            'event_date' => now()->toDateString(),
        ])->assertCreated();

        $itemId = $create->json('item.id');
        $reporterToken = $create->json('manage_token');

        $this->postJson("/api/items/{$itemId}/resolve", [
            'confirmation' => true,
            'resolved_by_name' => 'RUPP community member',
        ])
            ->assertOk()
            ->assertJsonPath('item.title', 'Motorbike key')
            ->assertJsonPath('item.resolved_by_name', 'RUPP community member');

        $this->getJson('/api/items')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/items/recycle-bin')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Motorbike key')
            ->assertJsonMissingPath('data.0.contact');

        $this->postJson("/api/items/{$itemId}/restore")
            ->assertForbidden();

        $this->withHeader('X-Reporter-Token', $reporterToken)
            ->postJson("/api/items/{$itemId}/restore")
            ->assertOk()
            ->assertJsonPath('item.resolved_at', null)
            ->assertJsonPath('item.status', 'open');

        $this->getJson('/api/items')->assertOk()->assertJsonPath('data.0.title', 'Motorbike key');
    }
}

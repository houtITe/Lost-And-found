<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Support\Facades\Storage;

class ResolvedItemCleanup
{
    public const RETENTION_DAYS = 2;

    public function purge(): int
    {
        $deleted = 0;
        $cutoff = now()->subDays(self::RETENTION_DAYS);

        Item::query()
            ->whereNotNull('resolved_at')
            ->where('resolved_at', '<', $cutoff)
            ->with(['comments:id,item_id,image_paths', 'claims:id,item_id,image_paths'])
            ->chunkById(100, function ($items) use (&$deleted): void {
                foreach ($items as $item) {
                    $this->deleteFiles($item->image_paths ?? []);

                    foreach ($item->comments as $comment) {
                        $this->deleteFiles($comment->image_paths ?? []);
                    }

                    foreach ($item->claims as $claim) {
                        $this->deleteFiles($claim->image_paths ?? []);
                    }

                    $item->delete();
                    $deleted++;
                }
            });

        return $deleted;
    }

    private function deleteFiles(array $paths): void
    {
        foreach (array_filter($paths) as $path) {
            Storage::disk('public')->delete($path);
        }
    }
}

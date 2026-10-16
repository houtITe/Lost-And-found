<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('items:purge-resolved', function () {
    $deleted = app(\App\Services\ResolvedItemCleanup::class)->purge();
    $this->info("Deleted {$deleted} expired resolved item(s).");
})->purpose('Permanently delete resolved items older than two days');

Schedule::command('items:purge-resolved')->daily();

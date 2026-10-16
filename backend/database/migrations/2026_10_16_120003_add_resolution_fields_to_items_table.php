<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->string('status_before_resolution', 20)->nullable()->after('status');
            $table->timestamp('resolved_at')->nullable()->after('status_before_resolution');
            $table->string('resolved_by_name', 100)->nullable()->after('resolved_at');
            $table->string('resolution_note', 500)->nullable()->after('resolved_by_name');
            $table->index('resolved_at');
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropIndex(['resolved_at']);
            $table->dropColumn([
                'status_before_resolution',
                'resolved_at',
                'resolved_by_name',
                'resolution_note',
            ]);
        });
    }
};

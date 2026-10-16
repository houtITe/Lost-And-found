<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
            $table->uuid('public_id')->nullable()->unique()->after('id');
            $table->string('reporter_name', 100)->nullable()->after('user_id');
            $table->string('contact', 80)->nullable()->after('reporter_name');
            $table->string('reporter_token_hash', 64)->nullable()->index()->after('contact');
            $table->string('keywords', 500)->nullable()->after('title');
            $table->json('image_paths')->nullable()->after('image_path');
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn([
                'public_id',
                'reporter_name',
                'contact',
                'reporter_token_hash',
                'keywords',
                'image_paths',
            ]);
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};

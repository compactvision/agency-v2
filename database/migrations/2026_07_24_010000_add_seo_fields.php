<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('reference');
        });

        DB::table('ads')
            ->select(['id', 'title', 'reference'])
            ->orderBy('id')
            ->chunkById(200, function ($ads) {
                foreach ($ads as $ad) {
                    DB::table('ads')
                        ->where('id', $ad->id)
                        ->update([
                            'slug' => Str::slug("{$ad->title}-{$ad->reference}"),
                        ]);
                }
            });

        Schema::table('pages', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('status');
            $table->string('meta_description', 320)->nullable()->after('meta_title');
            $table->string('og_image')->nullable()->after('meta_description');
            $table->boolean('noindex')->default(false)->after('og_image');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['meta_title', 'meta_description', 'og_image', 'noindex']);
        });

        Schema::table('ads', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};

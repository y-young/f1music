<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('songs', function (Blueprint $table) {
            $table->string('name', 100)->comment('曲名')->change();
            $table->string('origin', 200)->nullable()->comment('来源')->change();
            $table->string('tags', 200)->nullable()->after('user_id')->comment('曲目标签')->change();
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->string('reason', 200)->comment('原因')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('songs', function (Blueprint $table) {
            $table->string('name', 50)->comment('曲名')->change();
            $table->string('origin', 50)->nullable()->comment('来源')->change();
            $table->string('tags', 50)->nullable()->after('user_id')->comment('曲目标签')->change();
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->string('reason', 60)->comment('原因')->change();
        });
    }
};
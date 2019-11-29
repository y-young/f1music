<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSongsTags extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('songs', 'tags')) {
            Schema::table('songs', function (Blueprint $table) {
                $table->string('tags', '50')->nullable()->after('user_id')->comment('曲目标签');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('songs', 'tags')) {
            Schema::table('songs', function (Blueprint $table) {
                $table->dropColumn('tags');
            });
        }
    }
}

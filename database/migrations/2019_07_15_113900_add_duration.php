<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDuration extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('files', 'duration')) {
            Schema::table('files', function (Blueprint $table) {
                $table->unsignedSmallInteger('duration')->comment('音频时长');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('files', 'duration')) {
            Schema::table('files', function (Blueprint $table) {
                $table->dropColumn('duration');
            });
        }
    }
}

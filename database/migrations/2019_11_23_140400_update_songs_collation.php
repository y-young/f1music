<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;

class UpdateSongsCollation extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE songs CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
    }

    public function down()
    {
        DB::statement("ALTER TABLE songs CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci");
    }
}
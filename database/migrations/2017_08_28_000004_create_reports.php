<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReports extends Migration
{
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->engine = 'MyISAM';
            $table->collation = 'utf8_general_ci';
            $table->smallIncrements('id')->comment('ID');
            $table->unsignedSmallInteger('song_id')->comment('曲目ID');
            $table->string('reason', 60)->comment('原因');
            $table->char('user_id', 11)->comment('举报者学号');
            $table->timestamp('time')->useCurrent();
            $table->unique(['song_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::drop('reports');
    }
}

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVotes extends Migration
{
    public function up()
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->smallIncrements('id')->comment('ID');
            $table->unsignedSmallInteger('song_id')->comment('曲目ID');
            $table->tinyInteger('vote')->comment('投票');
            $table->char('user_id', 11)->comment('投票者学号');
            $table->timestamps();
            $table->unique(['song_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('votes');
    }
}
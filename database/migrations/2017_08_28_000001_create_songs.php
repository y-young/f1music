<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSongs extends Migration
{
    public function up()
    {
        Schema::create('songs', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_unicode_ci';
            $table->smallIncrements('id')->comment('ID');
            $table->enum('playtime', ['1', '2', '3', '4', '5', '6'])->comment('时段');
            $table->string('name', 30)->comment('曲名');
            $table->string('origin', 50)->nullable()->comment('来源');
            $table->unsignedSmallInteger('file_id')->comment('文件ID');
            $table->char('user_id', 11)->comment('上传者学号');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::drop('songs');
    }
}

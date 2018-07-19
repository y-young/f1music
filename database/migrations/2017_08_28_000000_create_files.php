<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFiles extends Migration
{
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->smallIncrements('id')->comment('ID');
            $table->string('md5', 32)->comment('文件MD5');
            $table->char('user_id', 11)->comment('上传者学号');
            $table->timestamp('time')->useCurrent();
        });
    }

    public function down()
    {
        Schema::drop('files');
    }
}

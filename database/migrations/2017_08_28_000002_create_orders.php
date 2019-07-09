<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrders extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->charset = 'utf8';
            $table->engine = 'InnoDB';
            $table->collation = 'utf8_general_ci';
            $table->char('user_id', 11)->comment('学号');
            $table->longText('order')->comment('曲目顺序');
            $table->primary('user_id');
        });
    }

    public function down()
    {
        Schema::drop('orders');
    }
}

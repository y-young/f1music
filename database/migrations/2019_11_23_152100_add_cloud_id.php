<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCloudID extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('files', 'cloud_id')) {
            Schema::table('files', function (Blueprint $table) {
                $table->string('cloud_id', '15')->nullable()->comment('云上传ID');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('files', 'cloud_id')) {
            Schema::table('files', function (Blueprint $table) {
                $table->dropColumn('cloud_id');
            });
        }
    }
}

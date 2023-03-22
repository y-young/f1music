<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE files CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        DB::statement("ALTER TABLE songs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        DB::statement("ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        DB::statement("ALTER TABLE votes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
        DB::statement("ALTER TABLE reports CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE files CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
        DB::statement("ALTER TABLE songs CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
        DB::statement("ALTER TABLE orders CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
        DB::statement("ALTER TABLE votes CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
        DB::statement("ALTER TABLE reports CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci");
    }
};
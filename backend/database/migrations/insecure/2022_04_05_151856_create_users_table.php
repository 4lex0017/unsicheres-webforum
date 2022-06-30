<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('insecure')->create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 15)->unique();
            $table->string('password');
            $table->string('birth_date')->nullable(false);
            $table->string('location')->default("");
            $table->string('about')->default("");
            $table->json('groups')->default(new Expression('(JSON_ARRAY())'));
            $table->string('profile_picture')->default("");
            $table->json('profile_comments')->default(new Expression('(JSON_ARRAY())'));
            $table->timestamps();
            $table->string('c_password')->default("");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('insecure')->dropIfExists('users');
    }
};

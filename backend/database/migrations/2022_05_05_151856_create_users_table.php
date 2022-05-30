<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('insecure')->create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('password');
            $table->string('name');
            $table->integer('score')->default(0);
            $table->integer('message_count')->default(0);
            $table->string('profile_picture')->nullable();
            $table->string('description')->default("");
            $table->string('birth_date')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
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

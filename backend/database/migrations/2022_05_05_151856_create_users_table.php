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
            $table->string('email');
            $table->string('password');
            $table->string('name');
            $table->integer('score');
            $table->integer('message_count');
            $table->string('profile_picture');
            $table->string('description');
            $table->string('birth_date');
            $table->string('location');
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

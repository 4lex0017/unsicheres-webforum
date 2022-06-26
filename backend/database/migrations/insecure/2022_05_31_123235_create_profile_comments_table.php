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
        Schema::connection('insecure')->create('profile_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('profile_id');
            $table->foreign('profile_id')->references('id')->on('users');
            $table->unsignedBigInteger('author');
            $table->foreign('author')->references('id')->on('users');
            $table->string('content', 50);
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
        Schema::connection('insecure')->dropIfExists('profile_comments');
    }
};

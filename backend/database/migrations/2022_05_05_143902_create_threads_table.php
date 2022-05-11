<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('insecure')->create('threads', function (Blueprint $table) {
            $table->id('thread_id');
            $table->unsignedBigInteger('poster_id');
            $table->foreign('poster_id')->references('user_id')->on('users');
            $table->string('thread_title', 100);
            $table->json('tags');
            $table->string('thread_prefix');
            $table->json('posts');
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
        Schema::connection('insecure')->dropIfExists('threads');
    }
};

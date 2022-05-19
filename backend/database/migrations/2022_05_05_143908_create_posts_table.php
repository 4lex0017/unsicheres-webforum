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
        Schema::connection('insecure')->create('posts', function (Blueprint $table) {
            $table->id('post_id');
            $table->unsignedBigInteger('poster_id');
            $table->foreign('poster_id')->references('user_id')->on('users');
            $table->json('edit_history');
            $table->integer('vote_count');
            $table->string('post_title', 100);
            $table->string('post_text');
            $table->integer('relative_post_id');
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
        Schema::connection('insecure')->dropIfExists('posts');
    }
};

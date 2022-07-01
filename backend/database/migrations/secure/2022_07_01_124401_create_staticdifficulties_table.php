<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
        Schema::connection('secure')->create('staticdifficulties', function (Blueprint $table) {
            $table->id();
            $table->integer('hash_difficulty');
        });
        DB::connection('secure')->table('staticdifficulties')->insert(['hash_difficulty' => 4]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('secure')->dropIfExists('staticdifficulties');
    }
};
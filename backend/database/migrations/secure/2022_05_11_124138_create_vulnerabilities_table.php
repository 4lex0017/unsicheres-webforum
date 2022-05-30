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
        Schema::connection('secure')->create('vulnerabilities', function (Blueprint $table) {
            $table->id('vulnerability_id');
            $table->string('uri');
            $table->integer('sxss_difficulty');
            $table->integer('rxss_difficulty');
            $table->integer('sqli_difficulty');
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
        Schema::connection('secure')->dropIfExists('vulnerabilities');
    }
};

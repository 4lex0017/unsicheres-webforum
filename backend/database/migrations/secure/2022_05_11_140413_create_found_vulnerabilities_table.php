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
        Schema::connection('secure')->create('found_vulnerabilities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('attacker_id');
            $table->foreign('attacker_id')->references('attacker_id')->on('attackers');
            $table->unsignedBigInteger('vulnerability_id');
            $table->foreign('vulnerability_id')->references('vulnerability_id')->on('vulnerabilities');
            $table->string('vuln_type');
            $table->integer('difficulty');
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
        Schema::connection('secure')->dropIfExists('found_vulnerabilities');
    }
};

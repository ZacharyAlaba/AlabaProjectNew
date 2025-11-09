<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('department'); // keep simple to match UI; you can normalize later
            $table->integer('credits');
            $table->integer('duration');
            $table->string('status')->default('Active'); // Active | Archived
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('courses');
    }
};

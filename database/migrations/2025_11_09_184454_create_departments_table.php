<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->integer('established');
            $table->string('head');
            $table->integer('faculty');
            $table->integer('students');
            $table->string('status')->default('Active'); // Active | Archived
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('departments');
    }
};

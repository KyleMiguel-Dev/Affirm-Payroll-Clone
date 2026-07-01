<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->date('hire_date');
            $table->enum('employment_type', ['full-time', 'part-time', 'contract', 'temporary'])->default('full-time');
            $table->enum('status', ['active', 'inactive', 'on-leave', 'terminated'])->default('active');
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('employment_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

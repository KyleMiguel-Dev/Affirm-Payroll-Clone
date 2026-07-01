<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_periods', function (Blueprint $table) {
            $table->id();
            $table->date('start_date');
            $table->date('end_date');
            $table->date('payment_date');
            $table->enum('frequency', ['weekly', 'bi-weekly', 'monthly'])->default('monthly');
            $table->enum('status', ['open', 'locked', 'paid'])->default('open');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('payment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_periods');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Customers', function (Blueprint $table): void {
            $table->increments('customer_id');
            $table->string('first_name', 80);
            $table->string('last_name', 80);
            $table->string('email')->unique();
            $table->string('phone', 30);
            $table->string('address');
        });

        Schema::create('Categories', function (Blueprint $table): void {
            $table->increments('category_id');
            $table->string('name', 100)->unique();
        });

        Schema::create('Products', function (Blueprint $table): void {
            $table->increments('product_id');
            $table->unsignedInteger('category_id');
            $table->string('name', 120);
            $table->decimal('price', 10, 2);
            $table->foreign('category_id')
                ->references('category_id')
                ->on('Categories')
                ->restrictOnDelete();
            $table->index('name');
        });

        Schema::create('Orders', function (Blueprint $table): void {
            $table->increments('order_id');
            $table->unsignedInteger('customer_id');
            $table->timestamp('order_date')->useCurrent();
            $table->string('status', 30)->default('Pending');
            $table->string('shipping_method', 20);
            $table->decimal('shipping_amount', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->foreign('customer_id')
                ->references('customer_id')
                ->on('Customers')
                ->restrictOnDelete();
        });

        Schema::create('Order_Items', function (Blueprint $table): void {
            $table->unsignedInteger('order_id');
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->primary(['order_id', 'product_id']);
            $table->foreign('order_id')
                ->references('order_id')
                ->on('Orders')
                ->cascadeOnDelete();
            $table->foreign('product_id')
                ->references('product_id')
                ->on('Products')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Order_Items');
        Schema::dropIfExists('Orders');
        Schema::dropIfExists('Products');
        Schema::dropIfExists('Categories');
        Schema::dropIfExists('Customers');
    }
};

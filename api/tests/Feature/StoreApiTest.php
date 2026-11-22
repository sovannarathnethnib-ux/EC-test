<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_is_seeded_and_category_product_endpoints_are_connected(): void
    {
        $this->seed();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(3);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(4)
            ->assertJsonFragment(['name' => 'Laptop']);

        $category = $this->postJson('/api/categories', ['name' => 'Peripherals'])
            ->assertCreated()
            ->json();

        $this->putJson('/api/categories/'.$category['category_id'], ['name' => 'Input Devices'])
            ->assertOk()
            ->assertJsonPath('name', 'Input Devices');

        $product = $this->postJson('/api/products', [
            'category_id' => $category['category_id'],
            'name' => 'Webcam',
            'price' => 45,
        ])
            ->assertCreated()
            ->assertJsonPath('category.name', 'Input Devices')
            ->json();

        $this->putJson('/api/products/'.$product['product_id'], [
            'category_id' => $category['category_id'],
            'name' => 'Webcam Pro',
            'price' => 50,
        ])
            ->assertOk()
            ->assertJsonPath('name', 'Webcam Pro');

        $this->deleteJson('/api/products/'.$product['product_id'])->assertNoContent();
        $this->deleteJson('/api/categories/'.$category['category_id'])->assertNoContent();
    }

    public function test_checkout_persists_a_server_priced_order_and_rejects_invalid_data(): void
    {
        $this->seed();

        $laptopId = Product::query()->where('name', 'Laptop')->value('product_id');
        $mouseId = Product::query()->where('name', 'Mouse')->value('product_id');

        $response = $this->postJson('/api/orders', [
            'customer' => [
                'first_name' => 'Alex',
                'last_name' => 'Morgan',
                'email' => 'alex@example.com',
                'phone' => '555-0100',
                'address' => '123 Anywhere Street',
            ],
            'shipping_method' => 'standard',
            'items' => [
                ['product_id' => $laptopId, 'quantity' => 1, 'unit_price' => 0],
                ['product_id' => $mouseId, 'quantity' => 1],
            ],
        ])
            ->assertCreated()
            ->assertJsonPath('order_number', 'ORD-0001')
            ->assertJsonPath('status', 'Pending')
            ->assertJsonPath('total_amount', 670);

        $this->getJson('/api/orders/'.$response->json('order_id'))
            ->assertOk()
            ->assertJsonPath('items.0.unit_price', 650);

        $this->assertDatabaseCount('Customers', 1);
        $this->assertDatabaseCount('Orders', 1);
        $this->assertDatabaseCount('Order_Items', 2);

        $this->postJson('/api/orders', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['customer', 'shipping_method', 'items']);
    }
}

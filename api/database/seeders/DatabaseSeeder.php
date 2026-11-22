<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = [];
        foreach (['Computers', 'Accessories', 'Displays'] as $name) {
            $categoryIds[$name] = Category::updateOrCreate(['name' => $name])->category_id;
        }

        $products = [
            ['name' => 'Laptop', 'category' => 'Computers', 'price' => 650],
            ['name' => 'Mouse', 'category' => 'Accessories', 'price' => 15],
            ['name' => 'Keyboard', 'category' => 'Accessories', 'price' => 25],
            ['name' => 'Monitor', 'category' => 'Displays', 'price' => 120],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                [
                    'category_id' => $categoryIds[$product['category']],
                    'price' => $product['price'],
                ],
            );
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    private const SHIPPING_CENTS = [
        'standard' => 500,
        'express' => 1500,
        'pickup' => 0,
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer' => ['required', 'array'],
            'customer.first_name' => ['required', 'string', 'max:80'],
            'customer.last_name' => ['required', 'string', 'max:80'],
            'customer.email' => ['required', 'email', 'max:255'],
            'customer.phone' => ['required', 'string', 'max:30'],
            'customer.address' => ['required', 'string', 'max:255'],
            'shipping_method' => ['required', 'in:standard,express,pickup'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:Products,product_id'],
            'items.*.quantity' => ['required', 'integer', 'between:1,99'],
        ]);

        $order = DB::transaction(function () use ($validated): Order {
            $customer = Customer::updateOrCreate(
                ['email' => $validated['customer']['email']],
                $validated['customer'],
            );
            $productIds = array_column($validated['items'], 'product_id');
            $products = Product::query()->whereIn('product_id', $productIds)->get()->keyBy('product_id');

            if ($products->count() !== count($productIds)) {
                throw ValidationException::withMessages([
                    'items' => 'One or more products are no longer available.',
                ]);
            }

            $subtotalCents = 0;
            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                $subtotalCents += (int) round((float) $product->price * 100) * $item['quantity'];
            }

            $shippingCents = self::SHIPPING_CENTS[$validated['shipping_method']];
            $order = Order::create([
                'customer_id' => $customer->customer_id,
                'order_date' => now(),
                'status' => 'Pending',
                'shipping_method' => $validated['shipping_method'],
                'shipping_amount' => $shippingCents / 100,
                'total_amount' => ($subtotalCents + $shippingCents) / 100,
            ]);

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                $order->items()->create([
                    'product_id' => $product->product_id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                ]);
            }

            return $order->load(['customer', 'items.product.category']);
        });

        return response()->json($this->present($order), 201);
    }

    public function show(int $order): JsonResponse
    {
        $record = Order::with(['customer', 'items.product.category'])->findOrFail($order);

        return response()->json($this->present($record));
    }

    private function present(Order $order): array
    {
        return [
            'order_id' => $order->order_id,
            'order_number' => sprintf('ORD-%04d', $order->order_id),
            'order_date' => $order->order_date->toISOString(),
            'status' => $order->status,
            'shipping_method' => $order->shipping_method,
            'shipping_amount' => (float) $order->shipping_amount,
            'total_amount' => (float) $order->total_amount,
            'customer' => [
                'customer_id' => $order->customer->customer_id,
                'first_name' => $order->customer->first_name,
                'last_name' => $order->customer->last_name,
                'email' => $order->customer->email,
                'phone' => $order->customer->phone,
                'address' => $order->customer->address,
            ],
            'items' => $order->items->map(fn (OrderItem $item): array => [
                'product_id' => $item->product->product_id,
                'name' => $item->product->name,
                'category_id' => $item->product->category_id,
                'category' => $item->product->category->name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
            ])->all(),
        ];
    }
}

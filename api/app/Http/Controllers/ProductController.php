<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['sometimes', 'integer', 'exists:Categories,category_id'],
        ]);

        $products = Product::query()
            ->with('category')
            ->when(
                isset($validated['category_id']),
                fn (Builder $query) => $query->where('category_id', $validated['category_id']),
            )
            ->orderBy('product_id')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:Categories,category_id'],
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
        ]);

        $product = Product::create($validated)->load('category');

        return response()->json($product, 201);
    }

    public function show(int $product): JsonResponse
    {
        return response()->json(Product::with('category')->findOrFail($product));
    }

    public function update(Request $request, int $product): JsonResponse
    {
        $record = Product::findOrFail($product);
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:Categories,category_id'],
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
        ]);

        $record->update($validated);

        return response()->json($record->refresh()->load('category'));
    }

    public function destroy(int $product): JsonResponse
    {
        $record = Product::findOrFail($product);
        if ($record->orderItems()->exists()) {
            return response()->json(['message' => 'A product in an order cannot be deleted.'], 409);
        }

        $record->delete();

        return response()->json(null, 204);
    }
}

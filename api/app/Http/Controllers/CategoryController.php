<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Category::query()->orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:Categories,name'],
        ]);

        return response()->json(Category::create($validated), 201);
    }

    public function show(int $category): JsonResponse
    {
        return response()->json(Category::findOrFail($category));
    }

    public function update(Request $request, int $category): JsonResponse
    {
        $record = Category::findOrFail($category);
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('Categories', 'name')->ignore($record->category_id, 'category_id'),
            ],
        ]);

        $record->update($validated);

        return response()->json($record->refresh());
    }

    public function destroy(int $category): JsonResponse
    {
        $record = Category::findOrFail($category);
        if ($record->products()->exists()) {
            return response()->json(['message' => 'A category with products cannot be deleted.'], 409);
        }

        $record->delete();

        return response()->json(null, 204);
    }
}

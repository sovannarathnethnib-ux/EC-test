<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $table = 'Orders';

    protected $primaryKey = 'order_id';

    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'order_date',
        'status',
        'shipping_method',
        'shipping_amount',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'order_date' => 'datetime',
            'shipping_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
}

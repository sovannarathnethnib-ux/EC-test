<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $table = 'Customers';

    protected $primaryKey = 'customer_id';

    public $timestamps = false;

    protected $fillable = ['first_name', 'last_name', 'email', 'phone', 'address'];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id', 'customer_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name','established','head','faculty','students','status'];

    // Allow /api/departments/{name}
    public function getRouteKeyName(): string {
        return 'name';
    }
}

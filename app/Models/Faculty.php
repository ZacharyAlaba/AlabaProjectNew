<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;
    protected $fillable = [
        'faculty_id', 'name', 'position', 'department', 'email', 'phone', 'joined', 'specialization', 'status'
    ];
}

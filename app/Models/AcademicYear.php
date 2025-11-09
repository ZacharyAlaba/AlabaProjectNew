<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = ['name','status','start','end'];

    // Allow /api/academic-years/{name}
    public function getRouteKeyName(): string {
        return 'name';
    }
}

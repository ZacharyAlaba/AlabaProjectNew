<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'name','code','department_id','credits','duration','status'
    ];

    public function department() {
        return $this->belongsTo(Department::class);
    }
}

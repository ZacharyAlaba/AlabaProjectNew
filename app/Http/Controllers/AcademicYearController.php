<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index() {
        return AcademicYear::orderBy('name','desc')->get();
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|unique:academic_years,name',
            'status' => 'required|string',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);
        return AcademicYear::create($data);
    }

    public function show(AcademicYear $academicYear) {
        return $academicYear;
    }

    public function update(Request $request, AcademicYear $academicYear) {
        $data = $request->validate([
            'status' => 'sometimes|string',
            'start' => 'sometimes|date',
            'end' => 'sometimes|date|after_or_equal:start',
            'name' => 'sometimes|string|unique:academic_years,name,' . $academicYear->id,
        ]);
        $academicYear->update($data);
        return $academicYear;
    }

    public function destroy(AcademicYear $academicYear) {
        $academicYear->delete();
        return response()->noContent();
    }
}

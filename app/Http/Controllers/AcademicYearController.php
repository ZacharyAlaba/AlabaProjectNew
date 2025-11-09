<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return AcademicYear::orderByDesc('name')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|string|unique:academic_years,name',
            'status'=>'required|in:Current,Planned,Completed,Archived',
            'start'=>'nullable|date',
            'end'=>'nullable|date|after_or_equal:start'
        ]);
        return AcademicYear::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'status'=>'in:Current,Planned,Completed,Archived',
            'start'=>'nullable|date',
            'end'=>'nullable|date|after_or_equal:start'
        ]);
        $academicYear->update($data);
        return $academicYear->fresh();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->noContent();
    }

    public function archive(AcademicYear $academicYear) {
        $academicYear->update(['status'=>'Archived']);
        return response()->json(['ok'=>true]);
    }

    public function activate(AcademicYear $academicYear) {
        $academicYear->update(['status'=>'Planned']);
        return response()->json(['ok'=>true]);
    }
}

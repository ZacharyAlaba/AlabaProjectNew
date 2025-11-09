<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Department::orderBy('name')->get();
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
            'name'=>'required|string|unique:departments,name',
            'established'=>'nullable|digits:4',
            'head'=>'nullable|string',
            'faculty_count'=>'nullable|integer|min:0',
            'student_count'=>'nullable|integer|min:0',
            'status'=>'in:Active,Archived'
        ]);
        return Department::create($data);
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
    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'established'=>'nullable|digits:4',
            'head'=>'nullable|string',
            'faculty_count'=>'nullable|integer|min:0',
            'student_count'=>'nullable|integer|min:0',
            'status'=>'in:Active,Archived'
        ]);
        $department->update($data);
        return $department->fresh();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Department $department)
    {
        $department->delete();
        return response()->noContent();
    }

    public function archive(Department $department) {
        $department->update(['status'=>'Archived']);
        return response()->json(['ok'=>true]);
    }

    public function activate(Department $department) {
        $department->update(['status'=>'Active']);
        return response()->json(['ok'=>true]);
    }
}

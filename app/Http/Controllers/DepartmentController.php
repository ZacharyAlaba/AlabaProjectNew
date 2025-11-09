<?php

namespace App\Http\Controllers;

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
            'name' => 'required|string|unique:departments,name',
            'established' => 'required|integer',
            'head' => 'required|string',
            'faculty' => 'required|integer',
            'students' => 'required|integer',
            'status' => 'required|string',
        ]);
        return Department::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show(Department $department)
    {
        return $department;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'established' => 'sometimes|integer',
            'head' => 'sometimes|string',
            'faculty' => 'sometimes|integer',
            'students' => 'sometimes|integer',
            'status' => 'sometimes|string',
            'name' => 'sometimes|string|unique:departments,name,' . $department->id,
        ]);
        $department->update($data);
        return $department;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy(Department $department)
    {
        $department->delete();
        return response()->noContent();
    }
}

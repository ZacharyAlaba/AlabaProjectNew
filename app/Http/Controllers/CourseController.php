<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Course::with('department:id,name')->orderBy('code')->get();
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
            'name'=>'required|string',
            'code'=>'required|string|unique:courses,code',
            'department_id'=>'required|exists:departments,id',
            'credits'=>'nullable|integer|min:0',
            'duration'=>'nullable|integer|min:1',
            'status'=>'in:Active,Archived'
        ]);
        return Course::create($data)->load('department:id,name');
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
    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'name'=>'sometimes|required|string',
            'department_id'=>'sometimes|required|exists:departments,id',
            'credits'=>'nullable|integer|min:0',
            'duration'=>'nullable|integer|min:1',
            'status'=>'in:Active,Archived'
        ]);
        $course->update($data);
        return $course->fresh()->load('department:id,name');
    }

    public function archive(Course $course) {
        $course->update(['status'=>'Archived']);
        return response()->json(['ok'=>true]);
    }

    public function activate(Course $course) {
        $course->update(['status'=>'Active']);
        return response()->json(['ok'=>true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return response()->noContent();
    }
}

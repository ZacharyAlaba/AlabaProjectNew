<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Map academic_year -> academicYear for frontend convenience
        return Faculty::all()->map(fn($f) => [
            'id' => $f->id,
            'faculty_id' => $f->faculty_id,
            'name' => $f->name,
            'position' => $f->position,
            'department' => $f->department,
            'email' => $f->email,
            'phone' => $f->phone,
            'joined' => $f->joined,
            'specialization' => $f->specialization,
            'status' => $f->status,
            'academicYear' => $f->academic_year,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'department' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'specialization' => 'required|string',
            'status' => 'required|string',
            'academic_year' => 'nullable|string', // now accepted
            'joined' => 'nullable|date'            // made optional
        ]);

        // Generate unique faculty_id
        do {
            $faculty_id = 'FAC' . mt_rand(100000, 999999);
        } while (Faculty::where('faculty_id', $faculty_id)->exists());

        $validated['faculty_id'] = $faculty_id;

        // If joined missing but academic_year provided you could set a default date
        if (empty($validated['joined']) && !empty($validated['academic_year'])) {
            // simple default: first day of Sept of first year segment
            $parts = explode('-', $validated['academic_year']);
            if (count($parts) === 2) {
                $validated['joined'] = $parts[0] . '-09-01';
            }
        }

        $faculty = Faculty::create($validated);

        return response()->json([
            'id' => $faculty->id,
            'faculty_id' => $faculty->faculty_id,
            'name' => $faculty->name,
            'position' => $faculty->position,
            'department' => $faculty->department,
            'email' => $faculty->email,
            'phone' => $faculty->phone,
            'joined' => $faculty->joined,
            'specialization' => $faculty->specialization,
            'status' => $faculty->status,
            'academicYear' => $faculty->academic_year,
        ], 201);
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|string',
            'position' => 'sometimes|string',
            'department' => 'sometimes|string',
            'email' => 'sometimes|email',
            'phone' => 'sometimes|string',
            'specialization' => 'sometimes|string',
            'status' => 'sometimes|string',
            'academic_year' => 'sometimes|string',
            'joined' => 'sometimes|date'
        ]);
        $faculty->update($data);
        return response()->json([
            'id' => $faculty->id,
            'faculty_id' => $faculty->faculty_id,
            'name' => $faculty->name,
            'position' => $faculty->position,
            'department' => $faculty->department,
            'email' => $faculty->email,
            'phone' => $faculty->phone,
            'joined' => $faculty->joined,
            'specialization' => $faculty->specialization,
            'status' => $faculty->status,
            'academicYear' => $faculty->academic_year,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['message' => 'Faculty deleted']);
    }
}

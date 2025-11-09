<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AcademicYearController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);
Route::put('/contacts/{id}', [ContactController::class, 'update']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

Route::apiResource('students', StudentController::class);
Route::apiResource('faculty', FacultyController::class);

// Departments
Route::get('departments', [DepartmentController::class,'index']);
Route::post('departments', [DepartmentController::class,'store']);
Route::put('departments/{department}', [DepartmentController::class,'update']);
Route::post('departments/{department}/archive', [DepartmentController::class,'archive']);
Route::post('departments/{department}/activate', [DepartmentController::class,'activate']);
Route::delete('departments/{department}', [DepartmentController::class,'destroy']);

// Courses
Route::get('courses', [CourseController::class,'index']);
Route::post('courses', [CourseController::class,'store']);
Route::put('courses/{course}', [CourseController::class,'update']);
Route::post('courses/{course}/archive', [CourseController::class,'archive']);
Route::post('courses/{course}/activate', [CourseController::class,'activate']);
Route::delete('courses/{course}', [CourseController::class,'destroy']);

// Academic Years
Route::get('academic-years', [AcademicYearController::class,'index']);
Route::post('academic-years', [AcademicYearController::class,'store']);
Route::put('academic-years/{academicYear}', [AcademicYearController::class,'update']);
Route::post('academic-years/{academicYear}/archive', [AcademicYearController::class,'archive']);
Route::post('academic-years/{academicYear}/activate', [AcademicYearController::class,'activate']);
Route::delete('academic-years/{academicYear}', [AcademicYearController::class,'destroy']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/dashboard', function () {
    try {
        return response()->json([
            'avg_gpa' => 3.5,
            'academic_year' => '2025-2026',
            'total_students' => 1200,
            'faculty_members' => 80,
            'active_courses' => 35,
            'departments' => 5,
            'growth_trends' => [
                'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                'students' => [1000, 1050, 1100, 1150, 1180, 1200],
                'faculty' => [70, 72, 75, 78, 79, 80],
            ],
            'faculty_distribution' => [
                'Business' => 40,
                'Computer Science' => 40,
            ],
        ]);
    } catch (\Exception $e) {
        \Log::error('Dashboard API error: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch dashboard data'], 500);
    }
});
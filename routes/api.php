<?php

use App\Http\Controllers\ContactController;
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

Route::get('/students', function () {
    try {
        return response()->json([
            [
                'id' => 'STU240001',
                'name' => 'John Smith',
                'course' => 'Computer Science',
                'year' => '3rd Year',
                'email' => 'john.smith@student.edu',
                'phone' => '+1 (555) 123-4567',
                'age' => 23,
                'gpa' => 3.85,
                'department' => 'Computer Science',
            ],
            [
                'id' => 'STU240002',
                'name' => 'Sarah Johnson',
                'course' => 'Business Administration',
                'year' => '2nd Year',
                'email' => 'sarah.johnson@student.edu',
                'phone' => '+1 (555) 234-5678',
                'age' => 21,
                'gpa' => 3.92,
                'department' => 'Business',
            ],
        ]);
    } catch (\Exception $e) {
        \Log::error('Students API error: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch students'], 500);
    }
});

Route::post('/students', function (Request $request) {
    try {
        $data = $request->json()->all();
        return response()->json(['message' => 'Student added', 'data' => $data], 201);
    } catch (\Exception $e) {
        \Log::error('Add student API error: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to add student'], 500);
    }
});
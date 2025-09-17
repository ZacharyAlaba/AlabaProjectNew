<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();
        $this->clearLoginAttempts($request);
        return response()->json(['success' => true, 'redirect' => '/admin']);
    }

    protected function sendFailedLoginResponse(Request $request)
    {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if ($credentials['email'] === 'zachary.alaba@urios.edu.ph' && $credentials['password'] === 'yourpassword') {
            $request->session()->put('authenticated', true);
            return response()->json(['message' => 'Login successful']);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        try {
            $this->guard()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json(['success' => true, 'redirect' => '/']);
        } catch (\Exception $e) {
            \Log::error('Logout error: ' . $e->getMessage());
            return response()->json(['error' => 'Logout failed'], 500);
        }
    }

    public function showLoginForm()
    {
        return view('welcome');
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return Contact::all();
    }

    public function store(Request $request)
    {
        $contact = Contact::create($request->only(['first_name', 'last_name', 'email', 'message']));
        return response()->json($contact, 201);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update($request->only(['first_name', 'last_name', 'email', 'message']));
        return response()->json($contact);
    }

    public function destroy($id)
    {
        Contact::destroy($id);
        return response()->json(['success' => true]);
    }
}

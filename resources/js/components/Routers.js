import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from "./Home";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";
import StudentManagement from "./StudentManagement";
import AddStudent from "./AddStudent";

function AppRoutes() {
    const location = useLocation();
    return (
        <>
            {location.pathname !== "/admin" && <Navbar />}
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contactus" element={<ContactUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />}>
                        <Route path="students" element={<StudentManagement />} />
                        <Route path="students/add" element={<AddStudent />} />
                        <Route path="faculty" element={<div>Faculty Management Page</div>} />
                        <Route path="reports" element={<div>Reports Page</div>} />
                        <Route path="settings" element={<div>Settings Page</div>} />
                        <Route path="profile" element={<div>Profile Page</div>} />
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default function Routers() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root')); 
}
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
import FacultyManagement from './FacultyManagement';
import Reports from "./Reports";
import Settings from "./Settings";
import MyProfile from "./MyProfile"; 

function AppRoutes() {
    const location = useLocation();
    // Hide Navbar on any /admin route
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <div className="page-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contactus" element={<ContactUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />}>
                        <Route path="students" element={<StudentManagement />} />
                        <Route path="faculty" element={<FacultyManagement />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="profile" element={<MyProfile />} />                        
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
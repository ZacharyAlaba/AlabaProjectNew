import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        course: "",
        year: "",
        email: "",
        phone: "",
        age: "",
        gpa: "",
        department: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                navigate("/admin/students");
            } else {
                console.error('Failed to add student');
            }
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <i className="fas fa-book-open sidebar-logo"></i>
                    <span>ZU University Portal</span>
                    <button className="close-btn">x</button>
                </div>
                <ul className="sidebar-menu">
                    <li><a href="/admin"><i className="fas fa-tachometer-alt"></i> Dashboard <span>Overview & Analytics</span></a></li>
                    <li><a href="/admin/students"><i className="fas fa-users"></i> Student Management</a></li>
                    <li><a href="/admin/faculty"><i className="fas fa-chalkboard-teacher"></i> Faculty Management</a></li>
                    <li><a href="/admin/reports"><i className="fas fa-file-alt"></i> Reports <span>Generate Reports</span></a></li>
                    <li><a href="/admin/settings"><i className="fas fa-cog"></i> Settings <span>System Configuration</span></a></li>
                    <li><a href="/admin/profile"><i className="fas fa-user"></i> My Profile <span>Account Settings</span></a></li>
                </ul>
                <button className="logout-btn" onClick={() => navigate('/login')}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </aside>
            <main className="main-content">
                <header className="top-bar">
                    <h1>Add Student</h1>
                    <button className="back-btn" onClick={() => navigate("/admin/students")}>Back</button>
                </header>
                <section className="add-student-form">
                    <form onSubmit={handleSubmit}>
                        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input name="id" placeholder="Student ID" value={formData.id} onChange={handleChange} required />
                        <select name="course" value={formData.course} onChange={handleChange} required>
                            <option value="">Select Course</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Business Administration">Business Administration</option>
                            <option value="Engineering">Engineering</option>
                        </select>
                        <select name="year" value={formData.year} onChange={handleChange} required>
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                        <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required />
                        <input name="gpa" type="number" step="0.01" placeholder="GPA" value={formData.gpa} onChange={handleChange} required />
                        <select name="department" value={formData.department} onChange={handleChange} required>
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Business">Business</option>
                            <option value="Engineering">Engineering</option>
                        </select>
                        <button type="submit">Save Student</button>
                    </form>
                </section>
            </main>
        </div>
    );
}
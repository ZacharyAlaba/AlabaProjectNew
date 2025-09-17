import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const sampleStudents = [
    { id: "STU240001", name: "John Michael Smith", course: "Computer Science", year: "3rd Year", email: "john.smith@student.edu", phone: "+1 (555) 123-4567", age: 23, gpa: 3.85, department: "Computer Science", status: "ACTIVE" },
    { id: "STU240002", name: "Sarah Johnson", course: "Business Administration", year: "2nd Year", email: "sarah.johnson@student.edu", phone: "+1 (555) 234-5678", age: 21, gpa: 3.92, department: "Business", status: "ACTIVE" },
    { id: "STU240003", name: "Michael Brown", course: "Engineering", year: "4th Year", email: "michael.brown@student.edu", phone: "+1 (555) 345-6789", age: 24, gpa: 3.67, department: "Engineering", status: "ACTIVE" },
    { id: "STU240004", name: "Emily Rose Davis", course: "Computer Science", year: "1st Year", email: "emily.davis@student.edu", phone: "+1 (555) 456-7890", age: 19, gpa: 4.00, department: "Computer Science", status: "ACTIVE" },
    { id: "STU240005", name: "Alex Jordan Wilson", course: "Business Administration", year: "3rd Year", email: "alex.wilson@student.edu", phone: "+1 (555) 567-8901", age: 22, gpa: 3.60, department: "Business", status: "ACTIVE" },
];

export default function StudentManagement() {
    const [students, setStudents] = useState(sampleStudents);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState("All Courses");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('/api/students');
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                } else {
                    setStudents([]);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudents([]);
            }
        };
        fetchStudents();
    }, []);

    const handleAddStudent = (newStudent) => {
        setStudents([...students, newStudent]);
        setShowAddModal(false);
    };

    const filteredStudents = students.filter(student => {
        return (filter === "All Courses" || student.course === filter) &&
               (departmentFilter === "All Departments" || student.department === departmentFilter);
    });

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
                    <h1>Students</h1>
                    <input type="search" placeholder="Search students by name, email, or student ID..." />
                    <i className="fas fa-bell notification"></i>
                    <div className="user-info">
                        <i className="fas fa-circle user-status online"></i>
                        <span>AU Admin User... ONLINE</span>
                    </div>
                    <button className="add-student-btn" onClick={() => setShowAddModal(true)}>+ Add Student</button>
                </header>
                <section className="dashboard-header">
                    <h2>Student Management</h2>
                    <p>Manage student profiles and academic information</p>
                </section>
                <section className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All Courses">All Courses</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business Administration">Business Administration</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                    <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                        <option value="All Departments">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Business">Business</option>
                        <option value="Engineering">Engineering</option>
                    </select>
                </section>
                <section className="students-grid">
                    {filteredStudents.map((student) => (
                        <div className="student-card" key={student.id}>
                            <div className="student-header">
                                <span className="initials">{student.name.split(' ').map(n => n[0]).join('')}</span>
                                <span className="status">{student.status}</span>
                            </div>
                            <h3>{student.name}</h3>
                            <p>{student.id}</p>
                            <p>{student.course} - {student.year}</p>
                            <p><i className="fas fa-envelope"></i> {student.email}</p>
                            <p><i className="fas fa-phone"></i> {student.phone}</p>
                            <p><i className="fas fa-user"></i> Age {student.age} years</p>
                            <p><i className="fas fa-building"></i> Dept: {student.department}</p>
                            <p>GPA: <span className="gpa">{student.gpa}</span></p>
                        </div>
                    ))}
                </section>
            </main>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="modal-overlay" style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div className="student-modal" style={{
                        background: "#23234a",
                        borderRadius: "16px",
                        padding: "32px",
                        width: "420px",
                        color: "#fff",
                        position: "relative"
                    }}>
                        <button
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}
                            onClick={() => setSelectedStudent(null)}
                        >×</button>
                        <h2>{selectedStudent.name}</h2>
                        <p>ID: {selectedStudent.id}</p>
                        <p>Course: {selectedStudent.course}</p>
                        <p>Year: {selectedStudent.year}</p>
                        <p>Email: {selectedStudent.email}</p>
                        <p>Phone: {selectedStudent.phone}</p>
                        <p>Age: {selectedStudent.age}</p>
                        <p>Department: {selectedStudent.department}</p>
                        <p>GPA: {selectedStudent.gpa}</p>
                        <p>Status: {selectedStudent.status}</p>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="modal-overlay" style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div className="add-student-modal" style={{
                        background: "#23234a",
                        borderRadius: "16px",
                        padding: "32px",
                        width: "420px",
                        color: "#fff",
                        position: "relative"
                    }}>
                        <button
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}
                            onClick={() => setShowAddModal(false)}
                        >×</button>
                        <h2>Add New Student</h2>
                        {/* Simple Add Student Form */}
                        <form onSubmit={e => {
                            e.preventDefault();
                            const form = e.target;
                            const newStudent = {
                                id: "STU" + Math.floor(Math.random() * 1000000),
                                name: form.name.value,
                                course: form.course.value,
                                year: form.year.value,
                                email: form.email.value,
                                phone: form.phone.value,
                                age: form.age.value,
                                gpa: form.gpa.value,
                                department: form.department.value,
                                status: "ACTIVE"
                            };
                            handleAddStudent(newStudent);
                        }}>
                            <input name="name" placeholder="Full Name" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="course" placeholder="Course" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="year" placeholder="Year" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="email" placeholder="Email" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="phone" placeholder="Phone" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="age" placeholder="Age" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="gpa" placeholder="GPA" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="department" placeholder="Department" required style={{ width: "100%", marginBottom: "8px" }} />
                            <button type="submit" style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 24px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                marginTop: "12px"
                            }}>Add Student</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
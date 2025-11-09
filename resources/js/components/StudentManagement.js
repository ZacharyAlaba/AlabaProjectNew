import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile";

// --- Activity Logging ---
function logActivity(type, desc) {
    const logs = JSON.parse(localStorage.getItem("activityLog") || "[]");
    logs.unshift({
        type,
        desc,
        time: new Date().toISOString()
    });
    localStorage.setItem("activityLog", JSON.stringify(logs));
}

// Utility functions
function normalizeStatus(s) {
    if (!s) return s;
    const map = { ACTIVE: "Active", OFFLINE: "Offline", GRADUATED: "Graduated" };
    return map[s] || s;
}
function getDepartments() {
    const stored = localStorage.getItem("departments");
    if (stored) {
        return JSON.parse(stored)
            .filter(dep => dep.status === "Active")
            .map(dep => dep.name);
    }
    return [];
}
function getCourses() {
    const stored = localStorage.getItem("courses");
    if (stored) {
        return JSON.parse(stored)
            .filter(course => course.status === "Active")
            .map(course => course.name);
    }
    return [];
}
function getAcademicYears() {
    const stored = localStorage.getItem("academicYears");
    if (stored) {
        // Show all except archived
        return JSON.parse(stored)
            .filter(y => y.status !== "Archived")
            .map(y => y.name);
    }
    return [];
}

const yearOptions = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year"
];

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);

    // filters
    const [filter, setFilter] = useState("All Courses");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // NEW: search query
    const [searchQuery, setSearchQuery] = useState("");

    const [departments, setDepartments] = useState(getDepartments());
    const [courses, setCourses] = useState(getCourses());
    const [academicYears, setAcademicYears] = useState(getAcademicYears());
    const menuRef = useRef(null);
    const profile = getProfile();

    // Fetch students from API
    useEffect(() => {
        axios.get("/api/students").then(res => {
            const data = Array.isArray(res.data)
                ? res.data.map(stu => ({ ...stu, status: normalizeStatus(stu.status) }))
                : [];
            setStudents(data);
            localStorage.setItem("students", JSON.stringify(data));
        });
    }, []);

    // Fetch departments/courses/years from localStorage (update if changed)
    useEffect(() => {
        setDepartments(getDepartments());
        setCourses(getCourses());
        setAcademicYears(getAcademicYears());
    }, []);

    // Add student handler (API)
    const handleAddStudent = async (newStudent) => {
        const res = await axios.post("/api/students", newStudent);
        const updated = [...students, res.data];
        setStudents(updated);
        localStorage.setItem("students", JSON.stringify(updated)); // Sync to localStorage
        // --- LOG ACTIVITY ---
        logActivity("student", `New student added: ${newStudent.name} (${newStudent.course})`);
        setShowAddModal(false);
    };

    // Delete student handler (API)
    const handleDeleteStudent = async (student_id) => {
        const student = students.find(s => s.student_id === student_id);
        await axios.delete(`/api/students/${student_id}`);
        const updated = students.filter(s => s.student_id !== student_id);
        setStudents(updated);
        localStorage.setItem("students", JSON.stringify(updated)); // Sync to localStorage
        // --- LOG ACTIVITY ---
        if (student) logActivity("student", `Student deleted: ${student.name} (${student.course})`);
        setMenuOpenId(null);
        setSelectedStudent(null);
    };

    // Edit student handler
    const handleEditStudent = (student) => {
        setEditStudent(student);
        setShowEditModal(true);
        setMenuOpenId(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.put(`/api/students/${editStudent.student_id}`, editStudent);
        const updated = students.map(s => s.student_id === editStudent.student_id ? res.data : s);
        setStudents(updated);
        localStorage.setItem("students", JSON.stringify(updated)); // Sync to localStorage
        // --- LOG ACTIVITY ---
        logActivity("student", `Student updated: ${editStudent.name} (${editStudent.course})`);
        setShowEditModal(false);
        setEditStudent(null);
    };

    // Filter students
    const filteredStudents = students.filter(student => {
        const courseMatch =
            filter === "All Courses" ||
            (student.course && student.course.toLowerCase().includes(filter.toLowerCase()));
        const deptMatch =
            departmentFilter === "All Departments" ||
            (student.department && student.department.toLowerCase().includes(departmentFilter.toLowerCase()));
        const statusMatch =
            statusFilter === "ALL" || student.status === statusFilter;

        // NEW: search match (name, email, student_id)
        const q = (searchQuery || "").trim().toLowerCase();
        const searchMatch =
            q.length === 0 ||
            [student.name, student.email, student.student_id]
                .filter(Boolean)
                .some(v => String(v).toLowerCase().includes(q));

        return courseMatch && deptMatch && statusMatch && searchMatch;
    });

    return (
        <div className="student-management-content">
            <header className="top-bar" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "18px" }}>
                <ProfileWidget profile={profile} />
            </header>

            <section className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2>Student Management</h2>
                    <p>Manage student profiles and academic information</p>
                </div>
                <button
                    className="add-student-btn"
                    style={{
                        background: "#a855f7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Student
                </button>
            </section>

            {/* Search + filters in one row (like Faculty) */}
            <section className="search-and-filter-row" style={{ marginTop: "12px", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                    {/* Search box (flex:1) */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                            background: "#23234a",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
                        }}
                    >
                        <i className="fas fa-search" style={{ color: "#a3a3a3", fontSize: "14px" }} aria-hidden="true"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search students by name, email, or student ID..."
                            aria-label="Search students"
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#fff",
                                fontSize: "14px"
                            }}
                        />
                    </div>

                    {/* All Courses */}
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        style={{
                            background: "#23234a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "14px",
                            minWidth: "180px"
                        }}
                    >
                        <option value="All Courses">All Courses</option>
                        {courses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>

                    {/* All Departments */}
                    <select
                        value={departmentFilter}
                        onChange={e => setDepartmentFilter(e.target.value)}
                        style={{
                            background: "#23234a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "14px",
                            minWidth: "180px"
                        }}
                    >
                        <option value="All Departments">All Departments</option>
                        {departments.map(dep => (
                            <option key={dep} value={dep}>{dep}</option>
                        ))}
                    </select>

                    {/* All Status */}
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{
                            background: "#23234a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            fontSize: "14px",
                            minWidth: "140px"
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Offline">Offline</option>
                        <option value="Graduated">Graduated</option>
                    </select>
                </div>
            </section>

            <section className="students-grid">
                {filteredStudents.map((student) => (
                    <div className="student-card" key={student.student_id} style={{ position: "relative" }}>
                        <div className="student-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span className="initials">
                                {student.name ? student.name.split(' ').map(n => n[0]).join('') : ""}
                            </span>
                            <span
                                className="status"
                                style={{
                                    background:
                                        student.status === "Active"
                                            ? "#a855f7"
                                            : student.status === "Offline"
                                                ? "#6366f1"
                                                : "#10b981", // Graduated
                                    color: "#fff",
                                    borderRadius: "12px",
                                    padding: "2px 18px",
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    marginLeft: "8px",
                                    display: "inline-block",
                                    minWidth: "70px",
                                    textAlign: "center",
                                    textTransform: "uppercase"
                                }}
                            >
                                {student.status}
                            </span>
                            <button
                                className="menu-btn"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",
                                    marginLeft: "auto",
                                    cursor: "pointer",
                                    fontSize: "22px"
                                }}
                                onClick={() => setMenuOpenId(student.student_id)}
                                aria-label="Open menu"
                            >
                                &#8942;
                            </button>
                            {menuOpenId === student.student_id && (
                                <div
                                    className="card-menu"
                                    ref={menuRef}
                                    style={{
                                        position: "absolute",
                                        top: "40px",
                                        right: "16px",
                                        background: "#23234a",
                                        borderRadius: "10px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        zIndex: 10,
                                        minWidth: "160px",
                                        padding: "8px 0"
                                    }}
                                >
                                    <button className="menu-item" style={menuItemStyle} onClick={() => { setMenuOpenId(null); setSelectedStudent(student); }}>
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                    <button className="menu-item" style={menuItemStyle} onClick={() => handleEditStudent(student)}>
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button className="menu-item" style={{ ...menuItemStyle, color: "#ef4444" }} onClick={() => handleDeleteStudent(student.student_id)}>
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <h3>{student.name}</h3>
                        <p>{student.student_id}</p>
                        <p>{student.course} - {student.year}</p>
                        <p>{student.email}</p>
                        <p>{student.phone}</p>
                        <p>Age {student.age} years</p>
                        <p>Dept: {student.department}</p>
                        <p>GPA: <span className="gpa">{student.gpa}</span></p>
                        <p>Academic Year: {student.academicYear || "-"}</p>
                    </div>
                ))}
            </section>

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
                        <p>ID: {selectedStudent.student_id}</p>
                        <p>Course: {selectedStudent.course}</p>
                        <p>Year: {selectedStudent.year}</p>
                        <p>Academic Year: {selectedStudent.academicYear || "-"}</p>
                        <p>Email: {selectedStudent.email}</p>
                        <p>Phone: {selectedStudent.phone}</p>
                        <p>Age: {selectedStudent.age}</p>
                        <p>Department: {selectedStudent.department}</p>
                        <p>GPA: {selectedStudent.gpa}</p>
                        <p>Status: {selectedStudent.status}</p>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditModal && editStudent && (
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
                            onClick={() => setShowEditModal(false)}
                        >×</button>
                        <h2>Edit Student</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input name="name" placeholder="Full Name" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.name}
                                onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} />
                            <select name="course" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent ? editStudent.course : ""}
                                onChange={e => editStudent ? setEditStudent({ ...editStudent, course: e.target.value }) : null}
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                            <select
                                name="year"
                                required
                                style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.year}
                                onChange={e => setEditStudent({ ...editStudent, year: e.target.value })}
                            >
                                <option value="">Select Year</option>
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <select name="academicYear" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.academicYear || ""}
                                onChange={e => setEditStudent({ ...editStudent, academicYear: e.target.value })}>
                                <option value="">Select Academic Year</option>
                                {academicYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <input name="email" placeholder="Email" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.email}
                                onChange={e => setEditStudent({ ...editStudent, email: e.target.value })} />
                            <input name="phone" placeholder="Phone" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.phone}
                                onChange={e => setEditStudent({ ...editStudent, phone: e.target.value })} />
                            <input name="age" placeholder="Age" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.age}
                                onChange={e => setEditStudent({ ...editStudent, age: e.target.value })} />
                            <input name="gpa" placeholder="GPA" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.gpa}
                                onChange={e => setEditStudent({ ...editStudent, gpa: e.target.value })} />
                            <select name="department" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.department}
                                onChange={e => setEditStudent({ ...editStudent, department: e.target.value })}>
                                <option value="">Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>
                            <select name="status" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.status}
                                onChange={e => setEditStudent({ ...editStudent, status: e.target.value })}>
                                <option value="Active">Active</option>
                                <option value="Offline">Offline</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                            <button type="submit" style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 24px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                marginTop: "12px"
                            }}>Save Changes</button>
                        </form>
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
                        <form onSubmit={e => {
                            e.preventDefault();
                            const form = e.target;
                            const newStudent = {
                                student_id: "STU" + Math.floor(Math.random() * 1000000),
                                name: form.name.value,
                                course: form.course.value,
                                year: form.year.value,
                                academicYear: form.academicYear.value,
                                email: form.email.value,
                                phone: form.phone.value,
                                age: form.age.value,
                                gpa: form.gpa.value,
                                department: form.department.value,
                                status: form.status.value // Title Case
                            };
                            handleAddStudent(newStudent);
                        }}>
                            <input name="name" placeholder="Full Name" required style={{ width: "100%", marginBottom: "8px" }} />
                            <select name="course" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                            <select name="year" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="">Select Year</option>
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <select name="academicYear" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="">Select Academic Year</option>
                                {academicYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <input name="email" placeholder="Email" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="phone" placeholder="Phone" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="age" placeholder="Age" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="gpa" placeholder="GPA" required style={{ width: "100%", marginBottom: "8px" }} />
                            <select name="department" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="">Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>
                            <select name="status" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="Active">Active</option>
                                <option value="Offline">Offline</option>
                                <option value="Graduated">Graduated</option>
                            </select>
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

const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background 0.2s",
};
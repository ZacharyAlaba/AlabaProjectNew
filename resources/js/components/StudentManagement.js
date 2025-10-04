import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile";

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editStudent, setEditStudent] = useState(null);
    const [filter, setFilter] = useState("All Courses");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const menuRef = useRef(null);
    const profile = getProfile();

    // Fetch students from API
    useEffect(() => {
        axios.get("/api/students").then(res => {
            setStudents(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    // Add student handler (API)
    const handleAddStudent = async (newStudent) => {
        const res = await axios.post("/api/students", newStudent);
        setStudents([...students, res.data]);
        setShowAddModal(false);
    };

    // Delete student handler (API)
    const handleDeleteStudent = async (student_id) => {
        await axios.delete(`/api/students/${student_id}`);
        setStudents(students.filter(s => s.student_id !== student_id));
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
        setStudents(students.map(s => s.student_id === editStudent.student_id ? res.data : s));
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
        return courseMatch && deptMatch;
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
                    <div className="student-card" key={student.student_id} style={{ position: "relative" }}>
                        <div className="student-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span className="initials">
                                {student.name ? student.name.split(' ').map(n => n[0]).join('') : ""}
                            </span>
                            <span className="status" style={{
                                background: "#a855f7",
                                color: "#fff",
                                borderRadius: "12px",
                                padding: "2px 10px",
                                fontSize: "12px",
                                marginLeft: "8px"
                            }}>{student.status}</span>
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
                                <option value="Computer Science">Computer Science</option>
                                <option value="Business Administration">Business Administration</option>
                                <option value="Engineering">Engineering</option>
                                <option value="BSIT">BSIT</option>
                            </select>
                            <input name="year" placeholder="Year" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.year}
                                onChange={e => setEditStudent({ ...editStudent, year: e.target.value })} />
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
                            <input name="department" placeholder="Department" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editStudent.department}
                                onChange={e => setEditStudent({ ...editStudent, department: e.target.value })} />
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
                                student_id: "STU" + Math.floor(Math.random() * 1000000), // <-- FIXED
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
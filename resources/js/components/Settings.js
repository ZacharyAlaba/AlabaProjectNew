import React, { useState } from "react";

const initialCourses = [
    {
        name: "Computer Science",
        code: "CS",
        department: "Engineering",
        credits: 120,
        duration: 4,
        status: "Active"
    },
    {
        name: "Business Administration",
        code: "BA",
        department: "Business",
        credits: 90,
        duration: 3,
        status: "Active"
    },
    {
        name: "Mechanical Engineering",
        code: "ME",
        department: "Engineering",
        credits: 128,
        duration: 4,
        status: "Active"
    },
    {
        name: "Medicine",
        code: "MD",
        department: "Medicine",
        credits: 180,
        duration: 6,
        status: "Active"
    },
    {
        name: "Elementary Education",
        code: "ED",
        department: "Education",
        credits: 96,
        duration: 4,
        status: "Archived"
    }
];

function getInitialCourses() {
    const stored = localStorage.getItem("courses");
    return stored ? JSON.parse(stored) : initialCourses;
}

export default function Settings() {
    const [tab, setTab] = useState("Courses");
    const [courses, setCourses] = useState(getInitialCourses());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editCourse, setEditCourse] = useState(null);

    // Persist courses to localStorage
    React.useEffect(() => {
        localStorage.setItem("courses", JSON.stringify(courses));
    }, [courses]);

    const handleAddCourse = (course) => {
        setCourses([...courses, course]);
        setShowAddModal(false);
    };

    const handleEditCourse = (course) => {
        setCourses(courses.map(c => c.code === course.code ? course : c));
        setEditCourse(null);
    };

    const handleArchiveCourse = (code) => {
        setCourses(courses.map(c => c.code === code ? { ...c, status: "Archived" } : c));
    };

    const handleActivateCourse = (code) => {
        setCourses(courses.map(c => c.code === code ? { ...c, status: "Active" } : c));
    };

    return (
        <div style={{ padding: "32px" }}>
            <h2 style={{ color: "#a855f7" }}>System Settings</h2>
            <p>Manage courses, departments, and academic years</p>
            <div style={{ display: "flex", gap: "12px", margin: "24px 0" }}>
                {["Courses", "Departments", "Academic Years"].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            background: tab === t ? "#23234a" : "transparent",
                            color: "#fff",
                            border: "none",
                            borderRadius: "16px",
                            padding: "8px 24px",
                            fontWeight: tab === t ? "bold" : "normal",
                            cursor: "pointer"
                        }}
                    >{t}</button>
                ))}
            </div>
            {tab === "Courses" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>Course Management</h3>
                        <button
                            style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 20px",
                                fontWeight: "bold"
                            }}
                            onClick={() => setShowAddModal(true)}
                        >+ Add Course</button>
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {courses.map(course => (
                            <div key={course.code} style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "320px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 320px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                    <i className="fas fa-book" style={{
                                        fontSize: "32px",
                                        color: "#3b82f6",
                                        marginRight: "12px"
                                    }}></i>
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "18px" }}>{course.name}</div>
                                        <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Code: {course.code}</div>
                                    </div>
                                    <span style={{
                                        marginLeft: "auto",
                                        background: course.status === "Active" ? "#22c55e" : "#71717a",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 12px",
                                        fontSize: "13px"
                                    }}>{course.status}</span>
                                </div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Department: {course.department}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Credits: {course.credits}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Duration: {course.duration} years</div>
                                {/* Three-dot menu */}
                                <button
                                    style={{
                                        position: "absolute",
                                        top: "18px",
                                        right: "18px",
                                        background: "none",
                                        border: "none",
                                        color: "#fff",
                                        fontSize: "22px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setEditCourse(course)}
                                    title="Edit"
                                >&#8942;</button>
                                {/* Archive/Activate button */}
                                {course.status === "Active" ? (
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: "18px",
                                            right: "18px",
                                            background: "#71717a",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "4px 14px",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleArchiveCourse(course.code)}
                                    >Archive</button>
                                ) : (
                                    <button
                                        style={{
                                            position: "absolute",
                                            bottom: "18px",
                                            right: "18px",
                                            background: "#22c55e",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "4px 14px",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleActivateCourse(course.code)}
                                    >Activate</button>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Add Course Modal */}
                    {showAddModal && (
                        <Modal title="Add Course" onClose={() => setShowAddModal(false)}>
                            <CourseForm
                                onSubmit={handleAddCourse}
                                onCancel={() => setShowAddModal(false)}
                            />
                        </Modal>
                    )}
                    {/* Edit Course Modal */}
                    {editCourse && (
                        <Modal title="Edit Course" onClose={() => setEditCourse(null)}>
                            <CourseForm
                                initial={editCourse}
                                onSubmit={handleEditCourse}
                                onCancel={() => setEditCourse(null)}
                            />
                        </Modal>
                    )}
                </>
            )}
            {tab === "Departments" && (
                <div style={{ color: "#fff", marginTop: "32px" }}>
                    <h3>Department Management</h3>
                    <p>Coming soon...</p>
                </div>
            )}
            {tab === "Academic Years" && (
                <div style={{ color: "#fff", marginTop: "32px" }}>
                    <h3>Academic Year Management</h3>
                    <p>Coming soon...</p>
                </div>
            )}
        </div>
    );
}

// Modal component
function Modal({ title, children, onClose }) {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
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
                    onClick={onClose}
                >×</button>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

// Course Form component
function CourseForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState(
        initial || {
            name: "",
            code: "",
            department: "",
            credits: "",
            duration: "",
            status: "Active"
        }
    );
    return (
        <form onSubmit={e => {
            e.preventDefault();
            onSubmit({ ...form, credits: Number(form.credits), duration: Number(form.duration) });
        }}>
            <input
                name="name"
                placeholder="Course Name"
                required
                style={inputStyle}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
                name="code"
                placeholder="Course Code"
                required
                style={inputStyle}
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                disabled={!!initial}
            />
            <input
                name="department"
                placeholder="Department"
                required
                style={inputStyle}
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
            />
            <input
                name="credits"
                placeholder="Credits"
                type="number"
                required
                style={inputStyle}
                value={form.credits}
                onChange={e => setForm({ ...form, credits: e.target.value })}
            />
            <input
                name="duration"
                placeholder="Duration (years)"
                type="number"
                required
                style={inputStyle}
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
            />
            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                <button
                    type="submit"
                    style={{
                        background: "#a855f7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >Save</button>
                <button
                    type="button"
                    style={{
                        background: "#23234a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 24px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    onClick={onCancel}
                >Cancel</button>
            </div>
        </form>
    );
}

const inputStyle = {
    width: "100%",
    marginBottom: "8px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#181826",
    color: "#fff",
    fontSize: "15px"
};
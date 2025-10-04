import React, { useState } from "react";
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile"; // Make sure getProfile is exported

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

const initialDepartments = [
    {
        name: "Engineering",
        established: 1995,
        head: "Dr. Robert Smith",
        faculty: 24,
        students: 567,
        status: "Active"
    },
    {
        name: "Business",
        established: 1998,
        head: "Prof. Sarah Johnson",
        faculty: 18,
        students: 423,
        status: "Active"
    },
    {
        name: "Medicine",
        established: 1992,
        head: "Dr. Michael Chen",
        faculty: 32,
        students: 234,
        status: "Active"
    },
    {
        name: "Education",
        established: 2001,
        head: "Dr. Emily Rodriguez",
        faculty: 15,
        students: 189,
        status: "Active"
    },
    {
        name: "Arts & Sciences",
        established: 2005,
        head: "Prof. David Wilson",
        faculty: 12,
        students: 156,
        status: "Archived"
    }
];

const initialAcademicYears = [
    {
        name: "2024-2025",
        status: "Current",
        start: "2024-09-01",
        end: "2025-06-30"
    },
    {
        name: "2025-2026",
        status: "Planned",
        start: "2025-09-01",
        end: "2026-06-30"
    },
    {
        name: "2023-2024",
        status: "Completed",
        start: "2023-09-01",
        end: "2024-06-30"
    },
    {
        name: "2022-2023",
        status: "Completed",
        start: "2022-09-01",
        end: "2023-06-30"
    }
];

function getInitialCourses() {
    const stored = localStorage.getItem("courses");
    return stored ? JSON.parse(stored) : initialCourses;
}

function getInitialDepartments() {
    const stored = localStorage.getItem("departments");
    return stored ? JSON.parse(stored) : initialDepartments;
}

function getInitialAcademicYears() {
    const stored = localStorage.getItem("academicYears");
    return stored ? JSON.parse(stored) : initialAcademicYears;
}

export default function Settings() {
    const [tab, setTab] = useState("Courses");
    const [courses, setCourses] = useState(getInitialCourses());
    const [departments, setDepartments] = useState(getInitialDepartments());
    const [academicYears, setAcademicYears] = useState(getInitialAcademicYears());
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
    const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [showAddYearModal, setShowAddYearModal] = useState(false);
    const [showEditYearModal, setShowEditYearModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    const [menuOpen, setMenuOpen] = useState({}); // Track which card's menu is open

    // Persist courses and departments to localStorage
    React.useEffect(() => {
        localStorage.setItem("courses", JSON.stringify(courses));
    }, [courses]);

    React.useEffect(() => {
        localStorage.setItem("departments", JSON.stringify(departments));
    }, [departments]);

    React.useEffect(() => {
        localStorage.setItem("academicYears", JSON.stringify(academicYears));
    }, [academicYears]);

    const handleAddCourse = (course) => {
        setCourses([...courses, course]);
        setShowAddCourseModal(false);
    };

    const handleEditCourse = (course) => {
        setCourses(courses.map(c => c.code === course.code ? course : c));
        setSelectedCourse(null);
        setShowEditCourseModal(false);
    };

    const handleArchiveCourse = (code) => {
        setCourses(courses.map(c => c.code === code ? { ...c, status: "Archived" } : c));
    };

    const handleActivateCourse = (code) => {
        setCourses(courses.map(c => c.code === code ? { ...c, status: "Active" } : c));
    };

    const profile = getProfile();

    return (
        <div style={{ padding: "32px" }}>
            <header className="top-bar" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <ProfileWidget profile={profile} />
            </header>
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
                            onClick={() => setShowAddCourseModal(true)}
                        >+ Add Course</button>
                    </div>
                    <div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "32px",
        marginTop: "24px"
    }}
>
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
            <div style={{ position: "relative" }}>
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
                    onClick={() => setMenuOpen({ ...menuOpen, [course.code]: !menuOpen[course.code] })}
                    title="Menu"
                >&#8942;</button>
                {menuOpen[course.code] && (
                    <div style={{
                        position: "absolute",
                        top: "40px",
                        right: "18px",
                        background: "#23234a",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 10,
                        minWidth: "140px",
                        padding: "8px 0"
                    }}>
                        <button style={menuItemStyle} onClick={() => {
                            setSelectedCourse(course);
                            setShowEditCourseModal(true);
                            setMenuOpen({});
                        }}>
                            <i className="fas fa-edit"></i> Edit
                        </button>
                        <button style={menuItemStyle} onClick={() => {
                            handleArchiveCourse(course.code);
                            setMenuOpen({});
                        }}>
                            <i className="fas fa-box-archive"></i> Archive
                        </button>
                    </div>
                )}
            </div>
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
                    {showAddCourseModal && (
                        <Modal title="Add Course" onClose={() => setShowAddCourseModal(false)}>
                            <CourseForm
                                onSubmit={handleAddCourse}
                                onCancel={() => setShowAddCourseModal(false)}
                            />
                        </Modal>
                    )}
                    {/* Edit Course Modal */}
                    {showEditCourseModal && selectedCourse && (
                        <Modal title="Edit Course" onClose={() => setShowEditCourseModal(false)}>
                            <CourseForm
                                initial={selectedCourse}
                                onSubmit={course => {
                                    handleEditCourse(course);
                                    setShowEditCourseModal(false);
                                }}
                                onCancel={() => setShowEditCourseModal(false)}
                            />
                        </Modal>
                    )}
                </>
            )}
            {tab === "Departments" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>Department Management</h3>
                        <button
                            style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 20px",
                                fontWeight: "bold"
                            }}
                            onClick={() => setShowAddDepartmentModal(true)}
                        >+ Add Department</button>
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {departments.map(dep => (
                            <div key={dep.name} style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "320px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 320px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                    <i className="fas fa-building" style={{
                                        fontSize: "32px",
                                        color: "#22c55e",
                                        marginRight: "12px"
                                    }}></i>
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "18px" }}>{dep.name}</div>
                                        <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Est. {dep.established}</div>
                                    </div>
                                    <span style={{
                                        marginLeft: "auto",
                                        background: dep.status === "Active" ? "#22c55e" : "#71717a",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 12px",
                                        fontSize: "13px"
                                    }}>{dep.status}</span>
                                </div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Department Head: {dep.head}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>{dep.faculty} Faculty</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>{dep.students} Students</div>
                                {/* Three-dot menu */}
                                <div style={{ position: "relative" }}>
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
                                        onClick={() => setMenuOpen({ ...menuOpen, [dep.name]: !menuOpen[dep.name] })}
                                        title="Menu"
                                    >&#8942;</button>
                                    {menuOpen[dep.name] && (
                                        <div style={{
                                            position: "absolute",
                                            top: "40px",
                                            right: "18px",
                                            background: "#23234a",
                                            borderRadius: "10px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                            zIndex: 10,
                                            minWidth: "140px",
                                            padding: "8px 0"
                                        }}>
                                            <button style={menuItemStyle} onClick={() => {
                                                setSelectedDepartment(dep);
                                                setShowEditDepartmentModal(true);
                                                setMenuOpen({});
                                            }}>
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button style={menuItemStyle} onClick={() => {
                                                setDepartments(departments.map(d => d.name === dep.name ? { ...d, status: "Archived" } : d));
                                                setMenuOpen({});
                                            }}>
                                                <i className="fas fa-box-archive"></i> Archive
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Add Department Modal */}
                    {showAddDepartmentModal && (
                        <Modal title="Add Department" onClose={() => setShowAddDepartmentModal(false)}>
                            {/* Department form component here */}
                        </Modal>
                    )}
                    {/* Edit Department Modal */}
                    {showEditDepartmentModal && selectedDepartment && (
                        <Modal title="Edit Department" onClose={() => setShowEditDepartmentModal(false)}>
                            {/* Department form component here with initial={selectedDepartment} */}
                        </Modal>
                    )}
                </>
            )}
            {tab === "Academic Years" && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>Academic Year Management</h3>
                        <button
                            style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 20px",
                                fontWeight: "bold"
                            }}
                            onClick={() => setShowAddYearModal(true)}
                        >+ Add Academic Year</button>
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {academicYears.map(year => (
                            <div key={year.name} style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "260px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 260px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                    <i className="fas fa-calendar" style={{
                                        fontSize: "32px",
                                        color: "#a855f7",
                                        marginRight: "12px"
                                    }}></i>
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "18px" }}>{year.name}</div>
                                        <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Academic Year</div>
                                    </div>
                                    <span style={{
                                        marginLeft: "auto",
                                        background: year.status === "Current" ? "#22c55e"
                                            : year.status === "Planned" ? "#fbbf24"
                                            : "#3b82f6",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 12px",
                                        fontSize: "13px"
                                    }}>{year.status}</span>
                                </div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Start Date: {year.start}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>End Date: {year.end}</div>
                                {/* Three-dot menu */}
                                <div style={{ position: "relative" }}>
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
                                        onClick={() => setMenuOpen({ ...menuOpen, [year.name]: !menuOpen[year.name] })}
                                        title="Menu"
                                    >&#8942;</button>
                                    {menuOpen[year.name] && (
                                        <div style={{
                                            position: "absolute",
                                            top: "40px",
                                            right: "18px",
                                            background: "#23234a",
                                            borderRadius: "10px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                            zIndex: 10,
                                            minWidth: "140px",
                                            padding: "8px 0"
                                        }}>
                                            <button style={menuItemStyle} onClick={() => {
                                                setSelectedYear(year);
                                                setShowEditYearModal(true);
                                                setMenuOpen({});
                                            }}>
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Add Academic Year Modal */}
                    {showAddYearModal && (
                        <Modal title="Add Academic Year" onClose={() => setShowAddYearModal(false)}>
                            {/* Academic year form component here */}
                        </Modal>
                    )}
                    {/* Edit Academic Year Modal */}
                    {showEditYearModal && selectedYear && (
                        <Modal title="Edit Academic Year" onClose={() => setShowEditYearModal(false)}>
                            {/* Academic year form component here with initial={selectedYear} */}
                        </Modal>
                    )}
                </>
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
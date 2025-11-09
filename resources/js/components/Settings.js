import React, { useState } from "react";
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile";

// REMOVE seed/localStorage helpers and calls:
// const initialDepartments = [...]
// const initialCourses = [...]
// const initialAcademicYears = [...]
// const SEED_FLAG = ...
// function ensureSeeded() { ... }
// ensureSeeded();
// function getInitialDepartments() { ... } etc.

// ADD a tiny API client
const apiBase = "/api";
async function json(res) {
    if (!res.ok) throw new Error((await res.text()) || res.statusText);
    return res.status === 204 ? null : res.json();
}
const settingsApi = {
    // departments
    listDepartments: () => fetch(`${apiBase}/departments`).then(json),
    createDepartment: (dep) => fetch(`${apiBase}/departments`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(dep)
    }).then(json),
    updateDepartment: (name, dep) => fetch(`${apiBase}/departments/${encodeURIComponent(name)}`, {
        method: "PUT", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(dep)
    }).then(json),
    deleteDepartment: (name) => fetch(`${apiBase}/departments/${encodeURIComponent(name)}`, { method: "DELETE" }).then(json),

    // courses
    listCourses: () => fetch(`${apiBase}/courses`).then(json),
    createCourse: (c) => fetch(`${apiBase}/courses`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(c)
    }).then(json),
    updateCourse: (code, c) => fetch(`${apiBase}/courses/${encodeURIComponent(code)}`, {
        method: "PUT", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(c)
    }).then(json),
    deleteCourse: (code) => fetch(`${apiBase}/courses/${encodeURIComponent(code)}`, { method: "DELETE" }).then(json),

    // academic years
    listYears: () => fetch(`${apiBase}/academic-years`).then(json),
    createYear: (y) => fetch(`${apiBase}/academic-years`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(y)
    }).then(json),
    updateYear: (name, y) => fetch(`${apiBase}/academic-years/${encodeURIComponent(name)}`, {
        method: "PUT", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(y)
    }).then(json),
    deleteYear: (name) => fetch(`${apiBase}/academic-years/${encodeURIComponent(name)}`, { method: "DELETE" }).then(json),
};

export default function Settings() {
    const [tab, setTab] = useState("Courses");
    const [departments, setDepartments] = useState([]);   // was getInitialDepartments()
    const [courses, setCourses] = useState([]);           // was getInitialCourses()
    const [academicYears, setAcademicYears] = useState([]); // was getInitialAcademicYears()

    // Modal states
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
    const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [showAddYearModal, setShowAddYearModal] = useState(false);
    const [showEditYearModal, setShowEditYearModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    const [menuOpen, setMenuOpen] = useState({});

    // LOAD from API on mount
    React.useEffect(() => {
        (async () => {
            try {
                const [deps, crs, yrs] = await Promise.all([
                    settingsApi.listDepartments(),
                    settingsApi.listCourses(),
                    settingsApi.listYears()
                ]);
                setDepartments(deps);
                setCourses(crs);
                setAcademicYears(yrs);
            } catch (e) {
                console.error(e);
                alert("Failed to load settings from server.");
            }
        })();
    }, []);

    // REMOVE the three localStorage persist effects
    // React.useEffect(() => { localStorage.setItem("departments", JSON.stringify(departments)); }, [departments]);
    // React.useEffect(() => { localStorage.setItem("courses", JSON.stringify(courses)); }, [courses]);
    // React.useEffect(() => { localStorage.setItem("academicYears", JSON.stringify(academicYears)); }, [academicYears]);

    // UPDATE handlers to call API
    const handleArchiveCourse = async (code) => {
        const updated = await settingsApi.updateCourse(code, { status: "Archived" });
        setCourses(courses.map(c => c.code === code ? updated : c));
    };
    const handleActivateCourse = async (code) => {
        const updated = await settingsApi.updateCourse(code, { status: "Active" });
        setCourses(courses.map(c => c.code === code ? updated : c));
    };
    const handleArchiveDepartment = async (name) => {
        const updated = await settingsApi.updateDepartment(name, { status: "Archived" });
        setDepartments(departments.map(d => d.name === name ? updated : d));
    };
    const handleActivateDepartment = async (name) => {
        const updated = await settingsApi.updateDepartment(name, { status: "Active" });
        setDepartments(departments.map(d => d.name === name ? updated : d));
    };
    const handleArchiveYear = async (name) => {
        const updated = await settingsApi.updateYear(name, { status: "Archived" });
        setAcademicYears(academicYears.map(y => y.name === name ? updated : y));
    };
    const handleActivateYear = async (name) => {
        const updated = await settingsApi.updateYear(name, { status: "Planned" });
        setAcademicYears(academicYears.map(y => y.name === name ? updated : y));
    };

    const handleDeleteDepartment = async (name) => {
        if (!window.confirm(`Delete department "${name}" permanently? This cannot be undone.`)) return;
        await settingsApi.deleteDepartment(name);
        setDepartments(departments.filter(d => d.name !== name));
    };
    const handleDeleteCourse = async (code) => {
        if (!window.confirm(`Delete course "${code}" permanently? This cannot be undone.`)) return;
        await settingsApi.deleteCourse(code);
        setCourses(courses.filter(c => c.code !== code));
    };
    const handleDeleteYear = async (name) => {
        if (!window.confirm(`Delete academic year "${name}" permanently? This cannot be undone.`)) return;
        await settingsApi.deleteYear(name);
        setAcademicYears(academicYears.filter(y => y.name !== name));
    };

    const handleAddCourse = async (course) => {
        if (courses.some(c => c.code === course.code)) {
            alert(`Course code "${course.code}" already exists.`);
            return;
        }
        const saved = await settingsApi.createCourse(course);
        setCourses([...courses, saved]);
        setShowAddCourseModal(false);
    };
    const handleEditCourse = async (course) => {
        const saved = await settingsApi.updateCourse(course.code, course);
        setCourses(courses.map(c => c.code === course.code ? saved : c));
        setSelectedCourse(null);
        setShowEditCourseModal(false);
    };
    const handleAddDepartment = async (dep) => {
        const saved = await settingsApi.createDepartment(dep);
        setDepartments([...departments, saved]);
        setShowAddDepartmentModal(false);
    };
    const handleEditDepartment = async (dep) => {
        const saved = await settingsApi.updateDepartment(dep.name, dep);
        setDepartments(departments.map(d => d.name === dep.name ? saved : d));
        setSelectedDepartment(null);
        setShowEditDepartmentModal(false);
    };
    const handleAddYear = async (year) => {
        const saved = await settingsApi.createYear(year);
        setAcademicYears([...academicYears, saved]);
        setShowAddYearModal(false);
    };
    const handleEditYear = async (year) => {
        const saved = await settingsApi.updateYear(year.name, year);
        setAcademicYears(academicYears.map(y => y.name === year.name ? saved : y));
        setSelectedYear(null);
        setShowEditYearModal(false);
    };

    // Split active/archived
    const activeDepartments = departments.filter(d => d.status !== "Archived");
    const archivedDepartments = departments.filter(d => d.status === "Archived");
    const activeCourses = courses.filter(c => c.status !== "Archived");
    const archivedCourses = courses.filter(c => c.status === "Archived");
    const activeYears = academicYears.filter(y => y.status !== "Archived");
    const archivedYears = academicYears.filter(y => y.status === "Archived");

    const profile = getProfile();

    return (
        <div style={{ padding: "32px" }}>
            <header className="top-bar" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <ProfileWidget profile={profile} />
            </header>
            <h2 style={{ color: "#a855f7" }}>System Settings</h2>
            <p>Manage courses, departments, and academic years</p>
            <div style={{ display: "flex", gap: "12px", margin: "24px 0" }}>
                {["Courses", "Departments", "Academic Years", "Archive"].map(t => (
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
            {/* Courses */}
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
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {activeCourses.map(course => (
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
                                    <button
                                        style={{
                                            marginLeft: "8px",
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
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Department: {course.department}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Credits: {course.credits}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Duration: {course.duration} years</div>
                            </div>
                        ))}
                    </div>
                    {showAddCourseModal && (
                        <Modal title="Add Course" onClose={() => setShowAddCourseModal(false)}>
                            <CourseForm
                                departments={departments}
                                onSubmit={handleAddCourse}
                                onCancel={() => setShowAddCourseModal(false)}
                            />
                        </Modal>
                    )}
                    {showEditCourseModal && selectedCourse && (
                        <Modal title="Edit Course" onClose={() => setShowEditCourseModal(false)}>
                            <CourseForm
                                initial={selectedCourse}
                                departments={departments}
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
            {/* Departments */}
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
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {activeDepartments.map(dep => (
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
                                    <button
                                        style={{
                                            marginLeft: "8px",
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
                                                handleArchiveDepartment(dep.name);
                                                setMenuOpen({});
                                            }}>
                                                <i className="fas fa-box-archive"></i> Archive
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Department Head: {dep.head}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>{dep.faculty} Faculty</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>{dep.students} Students</div>
                            </div>
                        ))}
                    </div>
                    {showAddDepartmentModal && (
                        <Modal title="Add Department" onClose={() => setShowAddDepartmentModal(false)}>
                            <DepartmentForm
                                onSubmit={handleAddDepartment}
                                onCancel={() => setShowAddDepartmentModal(false)}
                            />
                        </Modal>
                    )}
                    {showEditDepartmentModal && selectedDepartment && (
                        <Modal title="Edit Department" onClose={() => setShowEditDepartmentModal(false)}>
                            <DepartmentForm
                                initial={selectedDepartment}
                                onSubmit={dep => {
                                    handleEditDepartment(dep);
                                    setShowEditDepartmentModal(false);
                                }}
                                onCancel={() => setShowEditDepartmentModal(false)}
                            />
                        </Modal>
                    )}
                </>
            )}
            {/* Academic Years */}
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
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "32px",
                        marginTop: "24px"
                    }}>
                        {activeYears.map(year => (
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
                                    <button
                                        style={{
                                            marginLeft: "8px",
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
                                            <button style={menuItemStyle} onClick={() => {
                                                handleArchiveYear(year.name);
                                                setMenuOpen({});
                                            }}>
                                                <i className="fas fa-box-archive"></i> Archive
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>Start Date: {year.start}</div>
                                <div style={{ fontSize: "14px", marginBottom: "4px" }}>End Date: {year.end}</div>
                            </div>
                        ))}
                    </div>
                    {showAddYearModal && (
                        <Modal title="Add Academic Year" onClose={() => setShowAddYearModal(false)}>
                            <AcademicYearForm
                                onSubmit={handleAddYear}
                                onCancel={() => setShowAddYearModal(false)}
                            />
                        </Modal>
                    )}
                    {showEditYearModal && selectedYear && (
                        <Modal title="Edit Academic Year" onClose={() => setShowEditYearModal(false)}>
                            <AcademicYearForm
                                initial={selectedYear}
                                onSubmit={year => {
                                    handleEditYear(year);
                                    setShowEditYearModal(false);
                                }}
                                onCancel={() => setShowEditYearModal(false)}
                            />
                        </Modal>
                    )}
                </>
            )}
            {/* Archive Tab */}
            {tab === "Archive" && (
                <div>
                    <h3 style={{ color: "#a855f7" }}>Archived Departments</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "12px" }}>
                        {archivedDepartments.length === 0 && <p style={{ color: "#a3a3a3" }}>No archived departments.</p>}
                        {archivedDepartments.map(dep => (
                            <div key={dep.name} style={{
                                background: "#23234a",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "320px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 320px"
                            }}>
                                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{dep.name}</div>
                                <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Est. {dep.established}</div>
                                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                    <button
                                        style={{
                                            background: "#22c55e",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleActivateDepartment(dep.name)}
                                    >Activate</button>
                                    <button
                                        style={{
                                            background: "#ef4444",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleDeleteDepartment(dep.name)}
                                    >Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3 style={{ color: "#a855f7", marginTop: "32px" }}>Archived Courses</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "12px" }}>
                        {archivedCourses.length === 0 && <p style={{ color: "#a3a3a3" }}>No archived courses.</p>}
                        {archivedCourses.map(course => (
                            <div key={course.code} style={{
                                background: "#23234a",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "320px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 320px"
                            }}>
                                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{course.name}</div>
                                <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Code: {course.code}</div>
                                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                    <button
                                        style={{
                                            background: "#22c55e",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleActivateCourse(course.code)}
                                    >Activate</button>
                                    <button
                                        style={{
                                            background: "#ef4444",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleDeleteCourse(course.code)}
                                    >Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3 style={{ color: "#a855f7", marginTop: "32px" }}>Archived Academic Years</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "12px" }}>
                        {archivedYears.length === 0 && <p style={{ color: "#a3a3a3" }}>No archived academic years.</p>}
                        {archivedYears.map(year => (
                            <div key={year.name} style={{
                                background: "#23234a",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "260px",
                                color: "#fff",
                                position: "relative",
                                flex: "1 1 260px"
                            }}>
                                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{year.name}</div>
                                <div style={{ fontSize: "13px", color: "#a3a3a3" }}>Academic Year</div>
                                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                    <button
                                        style={{
                                            background: "#22c55e",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleActivateYear(year.name)}
                                    >Activate</button>
                                    <button
                                        style={{
                                            background: "#ef4444",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "6px 18px",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleDeleteYear(year.name)}
                                    >Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
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
function CourseForm({ initial, departments, onSubmit, onCancel }) {
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
            <select
                name="department"
                required
                style={inputStyle}
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
            >
                <option value="">Select Department</option>
                {departments.map(dep => (
                    <option key={dep.name} value={dep.name}>{dep.name}</option>
                ))}
            </select>
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

// Department Form component
function DepartmentForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState(
        initial || {
            name: "",
            established: "",
            head: "",
            faculty: "",
            students: "",
            status: "Active"
        }
    );
    return (
        <form onSubmit={e => {
            e.preventDefault();
            onSubmit({ ...form, faculty: Number(form.faculty), students: Number(form.students) });
        }}>
            <input
                name="name"
                placeholder="Department Name"
                required
                style={inputStyle}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                disabled={!!initial}
            />
            <input
                name="established"
                placeholder="Established Year"
                type="number"
                required
                style={inputStyle}
                value={form.established}
                onChange={e => setForm({ ...form, established: e.target.value })}
            />
            <input
                name="head"
                placeholder="Department Head"
                required
                style={inputStyle}
                value={form.head}
                onChange={e => setForm({ ...form, head: e.target.value })}
            />
            <input
                name="faculty"
                placeholder="Number of Faculty"
                type="number"
                required
                style={inputStyle}
                value={form.faculty}
                onChange={e => setForm({ ...form, faculty: e.target.value })}
            />
            <input
                name="students"
                placeholder="Number of Students"
                type="number"
                required
                style={inputStyle}
                value={form.students}
                onChange={e => setForm({ ...form, students: e.target.value })}
            />
            <select
                name="status"
                required
                style={inputStyle}
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
            >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
            </select>
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

// Academic Year Form component
function AcademicYearForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState(
        initial || {
            name: "",
            status: "Planned",
            start: "",
            end: ""
        }
    );
    return (
        <form onSubmit={e => {
            e.preventDefault();
            onSubmit(form);
        }}>
            <input
                name="name"
                placeholder="Academic Year (e.g. 2025-2026)"
                required
                style={inputStyle}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                disabled={!!initial}
            />
            <select
                name="status"
                required
                style={inputStyle}
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
            >
                <option value="Current">Current</option>
                <option value="Planned">Planned</option>
                <option value="Completed">Completed</option>
            </select>
            <input
                name="start"
                placeholder="Start Date (YYYY-MM-DD)"
                required
                style={inputStyle}
                value={form.start}
                onChange={e => setForm({ ...form, start: e.target.value })}
            />
            <input
                name="end"
                placeholder="End Date (YYYY-MM-DD)"
                required
                style={inputStyle}
                value={form.end}
                onChange={e => setForm({ ...form, end: e.target.value })}
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
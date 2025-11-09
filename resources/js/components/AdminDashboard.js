import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

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

// --- Helper functions for activity display ---
function getActivityIcon(type) {
    switch(type) {
        case "student": return "fas fa-user-graduate";
        case "faculty": return "fas fa-chalkboard-teacher";
        case "course": return "fas fa-book";
        case "department": return "fas fa-building";
        case "academicYear": return "fas fa-calendar";
        default: return "fas fa-info-circle";
    }
}
function getActivityColor(type) {
    switch(type) {
        case "student": return "#22c55e";
        case "faculty": return "#38bdf8";
        case "course": return "#a855f7";
        case "department": return "#fbbf24";
        case "academicYear": return "#6366f1";
        default: return "#fff";
    }
}
function getActivityTitle(type) {
    switch(type) {
        case "student": return "Student added";
        case "faculty": return "Faculty added";
        case "course": return "Course added";
        case "department": return "Department added";
        case "academicYear": return "Academic Year added";
        default: return "Activity";
    }
}

// Add status normalization
function normalizeStatus(s) {
  if (!s) return s;
  const up = s.toUpperCase();
  if (up === "ACTIVE") return "Active";
  if (up === "OFFLINE") return "Offline";
  if (up === "GRADUATED") return "Graduated";
  return s;
}

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState(
        JSON.parse(localStorage.getItem("students") || "[]").map(s => ({ ...s, status: normalizeStatus(s.status) }))
    );
    const [faculty, setFaculty] = useState(
        JSON.parse(localStorage.getItem("faculty") || "[]").map(f => ({ ...f, status: normalizeStatus(f.status) }))
    );

    // NEW: hold DB lists for courses and departments
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [facultyDistribution, setFacultyDistribution] = useState({});
    const [studentEnrollment, setStudentEnrollment] = useState({ labels: [], datasets: [] });
    const [growthTrends, setGrowthTrends] = useState({ labels: [], datasets: [] });

    // REMOVE these localStorage count states:
//  const [activeCourses, setActiveCourses] = useState(getActiveCourses());
//  const [activeDepartments, setActiveDepartments] = useState(getActiveDepartments());

    const navigate = useNavigate();
    const location = useLocation();
    const profile = getProfile();

    // Only count ACTIVE
    const activeStudents = students.filter(s => s.status === "Active");
    const activeFaculty = faculty.filter(f => f.status === "Active");

    // NEW: derive live counts from API-fetched data
    const activeCourses = courses.filter(c => c.status === "Active").length;
    const activeDepartments = departments.filter(d => d.status === "Active").length;

    // Calculate average GPA for active students
    const avg_gpa =
        activeStudents.length > 0
            ? (
                activeStudents
                    .map(s => parseFloat(s.gpa) || 0)
                    .reduce((a, b) => a + b, 0) / activeStudents.length
            ).toFixed(2)
            : 0;

    const academic_year = "2025-2026"; // Replace with dynamic value if needed

    // Fetch live stats from API
    useEffect(() => {
        axios.get("/api/students").then(res => {
            const list = Array.isArray(res.data)
              ? res.data.map(s => ({ ...s, status: normalizeStatus(s.status) }))
              : [];
            setStudents(list);
            localStorage.setItem("students", JSON.stringify(list));
        });
        axios.get("/api/faculty").then(res => {
            const list = Array.isArray(res.data)
              ? res.data.map(f => ({ ...f, status: normalizeStatus(f.status) }))
              : [];
            setFaculty(list);
            localStorage.setItem("faculty", JSON.stringify(list));
        });

        // NEW: fetch courses and departments from DB
        axios.get("/api/courses").then(res => {
            const list = Array.isArray(res.data) ? res.data : [];
            setCourses(list);
            // optional: keep a mirror if other parts still read from localStorage
            localStorage.setItem("courses", JSON.stringify(list));
        });
        axios.get("/api/departments").then(res => {
            const list = Array.isArray(res.data) ? res.data : [];
            setDepartments(list);
            // optional: keep a mirror if other parts still read from localStorage
            localStorage.setItem("departments", JSON.stringify(list));
        });
    }, []);

    // REMOVE the storage listener used to recalc counts (no longer needed)
//  useEffect(() => {
//      function updateCounts() {
//          setActiveCourses(getActiveCourses());
//          setActiveDepartments(getActiveDepartments());
//      }
//      window.addEventListener("storage", updateCounts);
//      updateCounts();
//      return () => window.removeEventListener("storage", updateCounts);
//  }, []);

    // Calculate faculty distribution by department
    useEffect(() => {
        const dist = {};
        faculty.forEach(f => {
            const dept = f.department || "Unknown";
            dist[dept] = (dist[dept] || 0) + 1;
        });
        setFacultyDistribution(dist);
    }, [faculty]);

    // Calculate student enrollment by course
    useEffect(() => {
        const enroll = {};
        students.forEach(s => {
            const course = s.course || "Unknown";
            enroll[course] = (enroll[course] || 0) + 1;
        });
        setStudentEnrollment({
            labels: Object.keys(enroll),
            datasets: [
                {
                    label: "Students",
                    data: Object.values(enroll),
                    backgroundColor: ["#a855f7", "#22c55e", "#3b82f6", "#fbbf24", "#ef4444"]
                }
            ]
        });
    }, [students]);

    // Generate Growth Trends (students and faculty count per month)
    useEffect(() => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(`${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`);
        }

        const studentCounts = months.map((label, idx) => {
            const [month, year] = label.split(" ");
            return students.filter(s => {
                if (!s.created_at) return false;
                const date = new Date(s.created_at);
                return (
                    date.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
                    date.getFullYear() === parseInt(year)
                );
            }).length;
        });

        const facultyCounts = months.map((label, idx) => {
            const [month, year] = label.split(" ");
            return faculty.filter(f => {
                if (!f.created_at) return false;
                const date = new Date(f.created_at);
                return (
                    date.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
                    date.getFullYear() === parseInt(year)
                );
            }).length;
        });

        setGrowthTrends({
            labels: months,
            datasets: [
                {
                    label: "Students",
                    data: studentCounts,
                    borderColor: "#a855f7",
                    backgroundColor: "rgba(168,85,247,0.2)",
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: "Faculty",
                    data: facultyCounts,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.2)",
                    tension: 0.4,
                    fill: true,
                }
            ]
        });
    }, [students, faculty]);

    const doughnutChartData = {
        labels: Object.keys(facultyDistribution),
        datasets: [
            {
                data: Object.values(facultyDistribution),
                backgroundColor: ['#22c55e', '#a855f7', '#3b82f6', '#fbbf24', '#ef4444'],
                hoverOffset: 4,
            },
        ],
    };

    // --- Recent Activity: Read from activityLog ---
    const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]");
    const recentActivity = activityLog.slice(0, 5).map(item => ({
        icon: getActivityIcon(item.type),
        color: getActivityColor(item.type),
        title: getActivityTitle(item.type),
        desc: item.desc,
        time: timeAgo(new Date(item.time))
    }));

    // Helper function to format "time ago"
    function timeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const menuItems = [
        { label: "Dashboard", icon: "fas fa-th-large", path: "/admin" },
        { label: "Student Management", icon: "fas fa-users", path: "/admin/students" },
        { label: "Faculty Management", icon: "fas fa-chalkboard-teacher", path: "/admin/faculty" },
        { label: "Reports", icon: "fas fa-file-alt", path: "/admin/reports" },
        { label: "Settings", icon: "fas fa-cog", path: "/admin/settings" },
        { label: "My Profile", icon: "fas fa-user", path: "/admin/profile" },
    ];

    const handleLogout = async () => {
        localStorage.clear();
        navigate("/");
    };

    // Stats (adjust student card to show total + active)
    const totalStudents = students.length;
    const totalFaculty = faculty.length;
    const percentActiveStudents = totalStudents > 0 ? ((activeStudents.length / totalStudents) * 100).toFixed(1) : "0.0";

    return (
        <div className="dashboard-container">
            {sidebarOpen && (
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <i className="fas fa-book-open sidebar-logo"></i>
                        <span>ZJ University Portal</span>
                        <button className="close-btn" onClick={() => setSidebarOpen(false)}>x</button>
                    </div>
                    <ul className="sidebar-menu">
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={location.pathname === item.path ? "active" : ""}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 20px",
                                        borderRadius: "10px",
                                        background: location.pathname === item.path ? "#a855f7" : "transparent",
                                        color: location.pathname === item.path ? "#fff" : "#b3b3c6",
                                        fontWeight: location.pathname === item.path ? "bold" : "normal",
                                        marginBottom: "8px",
                                        textDecoration: "none",
                                        transition: "background 0.2s"
                                    }}
                                >
                                    <i className={item.icon} style={{
                                        marginRight: "12px",
                                        color: location.pathname === item.path ? "#fff" : "#a855f7",
                                        fontSize: "20px"
                                    }}></i>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </aside>
            )}
            <main className="main-content">
                {/* Add a button to reopen the sidebar when closed */}
                {!sidebarOpen && (
                    <button
                        className="open-sidebar-btn"
                        style={{
                            position: "absolute",
                            top: "24px",
                            left: "24px",
                            zIndex: 1000,
                            background: "#181826",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer"
                        }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                )}
                {/* Only show dashboard content on /admin */}
                {location.pathname === "/admin" && (
                    <>
                        {/* Header */}
                        <header className="top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h1 style={{ fontSize: "2rem", color: "#a855f7", marginBottom: 0 }}>University Dashboard</h1>
                                <p style={{ color: "#9ca3af", marginTop: 4 }}>Comprehensive overview of your educational institution</p>
                            </div>
                            <ProfileWidget profile={profile} />
                        </header>
                        {/* GPA and Academic Year */}
                        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#22c55e" }}>{avg_gpa} Avg GPA</span>
                            <span style={{ background: "#23234a", color: "#fff", borderRadius: "8px", padding: "4px 16px", fontWeight: "bold" }}>
                                ACADEMIC YEAR {academic_year}
                            </span>
                        </div>
                        {/* Stats Cards */}
                        <section className="stats-cards" style={{ marginBottom: "24px", width: "100%" }}>
                            <div className="card student-card" style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "180px",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <i className="fas fa-user-graduate card-icon" style={{ fontSize: "32px", marginBottom: "8px" }}></i>
                                <h3 style={{ margin: 0 }}>Students</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{totalStudents}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>
                                  {activeStudents.length} active ({percentActiveStudents}%)
                                </span>
                            </div>
                            <div className="card faculty-card" style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "180px",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <i className="fas fa-chalkboard-teacher card-icon" style={{ fontSize: "32px", marginBottom: "8px" }}></i>
                                <h3 style={{ margin: 0 }}>Faculty</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{totalFaculty}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>
                                  {activeFaculty.length} active
                                </span>
                            </div>
                            <div className="card courses-card" style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "180px",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <i className="fas fa-book card-icon" style={{ fontSize: "32px", marginBottom: "8px" }}></i>
                                <h3 style={{ margin: 0 }}>Active Courses</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{activeCourses}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>
                                    +{activeCourses} total programs
                                </span>
                            </div>
                            <div className="card departments-card" style={{
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                minWidth: "180px",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                <i className="fas fa-building card-icon" style={{ fontSize: "32px", marginBottom: "8px" }}></i>
                                <h3 style={{ margin: 0 }}>Departments</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{activeDepartments}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>
                                    +{activeDepartments} total departments
                                </span>
                            </div>
                        </section>
                        {/* Growth Trends & Faculty Distribution */}
                        <section className="panels-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "18px", marginBottom: "24px", width: "100%" }}>
                            <div style={{ background: "#181826", borderRadius: "16px", padding: "24px" }}>
                                <h3 style={{ color: "#fff", marginBottom: "12px" }}>Growth Trends</h3>
                                <div style={{ width: "100%", height: "360px" }}>
                                    <Line
                                        data={growthTrends}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { labels: { color: "#fff" } }
                                            },
                                            scales: {
                                                x: { ticks: { color: "#fff" } },
                                                y: { ticks: { color: "#fff" } }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="chart distribution-chart" style={{ background: "#181826", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
                                <h3 style={{ marginBottom: "8px", color: "#fff" }}>Faculty Distribution</h3>
                                <p style={{ marginBottom: "16px", color: "#fff" }}>By Department</p>
                                <div className="doughnut-wrap" style={{ width: "100%", height: "300px" }}>
                                    <Doughnut
                                        data={doughnutChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom", labels: { color: "#fff", font: { size: 14 } } }
                                            },
                                            cutout: "60%"
                                         }}
                                     />
                                 </div>
                                 <div className="chart-legend" style={{ marginTop: "12px" }}>
                                     {Object.keys(facultyDistribution).map((dept, idx) => (
                                         <span key={dept} className="legend-item" style={{ color: doughnutChartData.datasets[0].backgroundColor[idx], marginLeft: idx > 0 ? "16px" : "0" }}>
                                             <i className="fas fa-circle"></i> {dept}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         </section>
                        {/* Recent Activity & Student Enrollment */}
                        <section style={{ display: "flex", gap: "24px" }}>
                            {/* Recent Activity */}
                            <div style={{
                                flex: 1,
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                marginRight: "12px"
                            }}>
                                <h3 style={{ color: "#fff", marginBottom: "16px" }}>Recent Activity</h3>
                                <div>
                                    {recentActivity.map((item, idx) => (
                                        <div key={idx} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            background: "#23234a",
                                            borderRadius: "10px",
                                            padding: "16px",
                                            marginBottom: "12px"
                                        }}>
                                            <i className={item.icon} style={{
                                                fontSize: "24px",
                                                color: item.color,
                                                marginRight: "16px"
                                            }}></i>
                                            <div>
                                                <div style={{ fontWeight: "bold", color: "#fff" }}>{item.title}</div>
                                                <div style={{ color: "#9ca3af", fontSize: "14px" }}>{item.desc}</div>
                                            </div>
                                            <div style={{ marginLeft: "auto", color: "#9ca3af", fontSize: "13px" }}>{item.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Student Enrollment */}
                            <div style={{
                                flex: 1,
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px"
                            }}>
                                <h3 style={{ color: "#fff", marginBottom: "16px" }}>Student Enrollment</h3>
                                <p style={{ color: "#9ca3af", marginBottom: "12px" }}>Distribution of students across different courses</p>
                                <div style={{ width: "100%", height: "220px" }}>
                                    <Bar
                                        data={studentEnrollment}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: "#fff" }
                                                },
                                                y: {
                                                    ticks: { color: "#fff" }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                    </>
                )}
                {/* This renders child routes like StudentManagement */}
                <Outlet />
            </main>
        </div>
    );
}
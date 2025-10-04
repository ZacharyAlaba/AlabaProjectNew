import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [totalStudents, setTotalStudents] = useState(0);
    const [facultyMembers, setFacultyMembers] = useState(0);
    const [facultyDistribution, setFacultyDistribution] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const profile = getProfile();

    // Fetch live stats from API
    useEffect(() => {
        axios.get("/api/students").then(res => {
            setTotalStudents(Array.isArray(res.data) ? res.data.length : 0);
        });
        axios.get("/api/faculty").then(res => {
            if (Array.isArray(res.data)) {
                setFacultyMembers(res.data.length);
                // Distribution by department
                const dist = {};
                res.data.forEach(f => {
                    dist[f.department] = (dist[f.department] || 0) + 1;
                });
                setFacultyDistribution(dist);
            } else {
                setFacultyMembers(0);
                setFacultyDistribution({});
            }
        });
    }, []);

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

    const avg_gpa = 0; // Replace with actual calculation if needed
    const academic_year = "2025-2026"; // Replace with dynamic value if needed
    const activeCourses = 3; // Replace with actual count if needed
    const departments = Object.keys(facultyDistribution).length;

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
            <main className="main-content" style={{ marginLeft: sidebarOpen ? "250px" : "0", transition: "margin-left 0.3s" }}>
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
                        <header className="top-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h1>Dashboard</h1>
                            <ProfileWidget profile={profile} />
                        </header>
                        <section className="dashboard-header">
                            <h2 style={{ color: "#a855f7" }}>University Dashboard</h2>
                            <p>Comprehensive overview of your educational institution</p>
                            <div className="gpa-year">
                                <span>{avg_gpa} Avg GPA</span>
                                <span>ACADEMIC YEAR {academic_year}</span>
                            </div>
                        </section>
                        <section className="stats-cards" style={{
                            display: "flex",
                            gap: "24px",
                            marginBottom: "32px",
                            justifyContent: "center"
                        }}>
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
                                <h3 style={{ margin: 0 }}>Total Students</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{totalStudents}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>+100.0% active</span>
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
                                <h3 style={{ margin: 0 }}>Faculty Members</h3>
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{facultyMembers}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>+2 active members</span>
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
                                <span className="growth" style={{ color: "#22c55e" }}>+3 total programs</span>
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
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{departments}</p>
                                <span className="growth" style={{ color: "#22c55e" }}>+3 total departments</span>
                            </div>
                        </section>
                        <section className="charts-section" style={{
                            display: "flex",
                            gap: "24px",
                            justifyContent: "center"
                        }}>
                            <div className="chart distribution-chart" style={{
                                width: "320px",
                                background: "#181826",
                                borderRadius: "16px",
                                padding: "24px",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <h3 style={{ marginBottom: "8px", color: "#fff" }}>Faculty Distribution</h3>
                                <p style={{ marginBottom: "16px", color: "#fff" }}>By Department</p>
                                <div style={{ width: "180px", height: "180px" }}>
                                    <Doughnut
                                        data={doughnutChartData}
                                        options={{
                                            responsive: false,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                    labels: {
                                                        color: "#fff",
                                                        font: { size: 14 }
                                                    }
                                                }
                                            }
                                        }}
                                        width={180}
                                        height={180}
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
                    </>
                )}
                {/* This renders child routes like StudentManagement */}
                <Outlet />
            </main>
        </div>
    );
}
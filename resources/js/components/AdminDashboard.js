import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (error) {
                setDashboardData({
                    avg_gpa: 3.5,
                    academic_year: "2025-2026",
                    total_students: 1200,
                    faculty_members: 80,
                    active_courses: 35,
                    departments: 5,
                    faculty_distribution: {
                        Business: 40,
                        "Computer Science": 40
                    }
                });
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!dashboardData) {
        return <div className="loading">Loading...</div>;
    }

    const doughnutChartData = {
        labels: Object.keys(dashboardData.faculty_distribution),
        datasets: [
            {
                data: Object.values(dashboardData.faculty_distribution),
                backgroundColor: ['#22c55e', '#a855f7'],
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
                        <header className="top-bar">
                            <h1>Dashboard</h1>
                            <input type="search" placeholder="Search..." />
                            <i className="fas fa-bell notification"></i>
                            <div className="user-info">
                                <i className="fas fa-circle user-status online"></i>
                                <span>AU Admin User... ONLINE</span>
                            </div>
                        </header>
                        <section className="dashboard-header">
                            <h2 style={{ color: "#a855f7" }}>University Dashboard</h2>
                            <p>Comprehensive overview of your educational institution</p>
                            <div className="gpa-year">
                                <span>{dashboardData.avg_gpa} Avg GPA</span>
                                <span>ACADEMIC YEAR {dashboardData.academic_year}</span>
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
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{dashboardData.total_students}</p>
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
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{dashboardData.faculty_members}</p>
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
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{dashboardData.active_courses}</p>
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
                                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>{dashboardData.departments}</p>
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
                                    <span className="legend-item business" style={{ color: "#22c55e" }}>
                                        <i className="fas fa-circle"></i> Business
                                    </span>
                                    <span className="legend-item cs" style={{ color: "#a855f7", marginLeft: "16px" }}>
                                        <i className="fas fa-circle"></i> Computer Science
                                    </span>
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
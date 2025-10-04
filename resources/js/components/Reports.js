import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ProfileWidget from "./ProfileWidget";
import { getProfile } from "./MyProfile"; // Make sure getProfile is exported

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const courses = [
    "Computer Science",
    "Business Administration",
    "Mechanical Engineering",
    "Medicine",
    "Elementary Education"
];

const departments = [
    "Engineering",
    "Business",
    "Medicine",
    "Education",
    "Arts & Sciences"
];

const academicYears = [
    "2024-2025",
    "2023-2024",
    "2022-2023"
];

const studentByCourse = [324, 289, 267, 218, 178];
const facultyByDept = [24, 18, 32, 15, 12];

const studentDetails = [
    { course: "Computer Science", total: 324, active: 302, avgGpa: 3.65 },
    { course: "Business Administration", total: 289, active: 267, avgGpa: 3.72 },
    { course: "Mechanical Engineering", total: 267, active: 245, avgGpa: 3.58 },
    { course: "Medicine", total: 218, active: 178, avgGpa: 3.89 },
    { course: "Elementary Education", total: 178, active: 156, avgGpa: 3.71 }
];

const facultyDetails = [
    { dept: "Engineering", total: 24, professors: 8, associates: 10 },
    { dept: "Business", total: 18, professors: 5, associates: 8 },
    { dept: "Medicine", total: 32, professors: 12, associates: 15 },
    { dept: "Education", total: 15, professors: 4, associates: 7 },
    { dept: "Arts & Sciences", total: 12, professors: 3, associates: 5 }
];

function getStudentCount() {
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    return students.length;
}
function getFacultyCount() {
    const faculty = JSON.parse(localStorage.getItem("faculty") || "[]");
    return faculty.length;
}

export default function Reports() {
    const [reportType, setReportType] = useState("Student Report");
    const [course, setCourse] = useState("All Courses");
    const [academicYear, setAcademicYear] = useState("2024-2025");
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        fetch("/api/students")
            .then(res => res.json())
            .then(data => setStudents(data));
        fetch("/api/faculty")
            .then(res => res.json())
            .then(data => setFaculty(data));
    }, []);

    const totalStudents = students.length;
    const totalFaculty = faculty.length;

    // Chart data
    const barData = {
        labels: courses,
        datasets: [
            {
                label: "Students",
                data: studentByCourse,
                backgroundColor: "#3b82f6"
            }
        ]
    };

    const pieData = {
        labels: departments,
        datasets: [
            {
                label: "Faculty",
                data: facultyByDept,
                backgroundColor: [
                    "#fbbf24",
                    "#22d3ee",
                    "#f87171",
                    "#a78bfa",
                    "#4ade80"
                ]
            }
        ]
    };

    const profile = getProfile();

    return (
        <div className="reports-content" style={{ padding: "32px" }}>
            <header className="top-bar" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <ProfileWidget profile={profile} />
            </header>
            <h2 style={{ color: "#a855f7" }}>Reports</h2>
            <p>Generate and analyze comprehensive reports</p>
            <div className="report-filters" style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                margin: "24px 0"
            }}>
                <select value={reportType} onChange={e => setReportType(e.target.value)} style={filterStyle}>
                    <option>Student Report</option>
                    <option>Faculty Report</option>
                </select>
                <select value={course} onChange={e => setCourse(e.target.value)} style={filterStyle}>
                    <option>All Courses</option>
                    {courses.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={filterStyle}>
                    {academicYears.map(y => <option key={y}>{y}</option>)}
                </select>
                <button style={{
                    background: "#a855f7",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    marginLeft: "auto"
                }}>Generate Report</button>
                <button style={{
                    background: "#23234a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    marginLeft: "8px"
                }}>Download</button>
            </div>
            <div className="report-stats" style={{
                display: "flex",
                gap: "32px",
                margin: "32px 0"
            }}>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-user-graduate" style={{ fontSize: "32px", color: "#3b82f6" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>{totalStudents}</div>
                    <div>Total Students</div>
                    <div style={{ color: "#22c55e", fontSize: "13px" }}>↑ +12.5%</div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-user-tie" style={{ fontSize: "32px", color: "#22d3ee" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>{totalFaculty}</div>
                    <div>Total Faculty</div>
                    <div style={{ color: "#22c55e", fontSize: "13px" }}>↑ +3.1%</div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-file-alt" style={{ fontSize: "32px", color: "#a855f7" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>3.74</div>
                    <div>Average GPA</div>
                    <div style={{ color: "#22c55e", fontSize: "13px" }}>↑ +0.05</div>
                </div>
            </div>
            <div className="charts-row" style={{
                display: "flex",
                gap: "32px",
                marginBottom: "32px"
            }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: "#fff" }}>Students by Course</h4>
                    <Bar data={barData} options={{
                        responsive: true,
                        plugins: { legend: { display: false } }
                    }} height={220} />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: "#fff" }}>Faculty by Department</h4>
                    <Pie data={pieData} options={{
                        responsive: true,
                        plugins: { legend: { position: "bottom", labels: { color: "#fff" } } }
                    }} height={220} />
                </div>
            </div>
            <div className="details-row" style={{
                display: "flex",
                gap: "32px"
            }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: "#fff" }}>Student Report Details</h4>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Total</th>
                                <th>Active</th>
                                <th>Avg GPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentDetails.map(row => (
                                <tr key={row.course}>
                                    <td>{row.course}</td>
                                    <td>{row.total}</td>
                                    <td>{row.active}</td>
                                    <td>{row.avgGpa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ color: "#fff" }}>Faculty Report Details</h4>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Total</th>
                                <th>Professors</th>
                                <th>Associates</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyDetails.map(row => (
                                <tr key={row.dept}>
                                    <td>{row.dept}</td>
                                    <td>{row.total}</td>
                                    <td>{row.professors}</td>
                                    <td>{row.associates}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const filterStyle = {
    background: "#23234a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "15px"
};

const statCardStyle = {
    background: "#181826",
    borderRadius: "16px",
    padding: "24px",
    minWidth: "180px",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1
};

const tableStyle = {
    width: "100%",
    background: "#181826",
    color: "#fff",
    borderRadius: "10px",
    borderCollapse: "collapse",
    marginTop: "12px"
};

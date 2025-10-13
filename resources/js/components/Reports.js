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
import { getProfile } from "./MyProfile";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Utility functions for live data
function getActiveCourses() {
    const stored = localStorage.getItem("courses");
    if (stored) {
        return JSON.parse(stored)
            .filter(c => c.status === "Active")
            .map(c => c.name);
    }
    return [];
}
function getActiveDepartments() {
    const stored = localStorage.getItem("departments");
    if (stored) {
        return JSON.parse(stored)
            .filter(d => d.status === "Active")
            .map(d => d.name);
    }
    return [];
}
function getAcademicYears() {
    const stored = localStorage.getItem("academicYears");
    if (stored) {
        return JSON.parse(stored).map(y => y.name);
    }
    return [];
}
function getStudents() {
    const stored = localStorage.getItem("students");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}
function getFaculty() {
    const stored = localStorage.getItem("faculty");
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

export default function Reports() {
    const [reportType, setReportType] = useState("Student Report");
    const [courses, setCourses] = useState(getActiveCourses());
    const [departments, setDepartments] = useState(getActiveDepartments());
    const [academicYears, setAcademicYears] = useState(getAcademicYears());
    const [students, setStudents] = useState(getStudents());
    const [faculty, setFaculty] = useState(getFaculty());

    // Filters (for dropdowns)
    const [course, setCourse] = useState("All Courses");
    const [academicYear, setAcademicYear] = useState(academicYears[0] || "");

    // Filters to apply when Generate Report is clicked
    const [reportFilters, setReportFilters] = useState({
        reportType: "Student Report",
        course: "All Courses",
        academicYear: academicYears[0] || ""
    });

    // Live update on localStorage change
    useEffect(() => {
        function updateLists() {
            setCourses(getActiveCourses());
            setDepartments(getActiveDepartments());
            setAcademicYears(getAcademicYears());
            setStudents(getStudents());
            setFaculty(getFaculty());
        }
        window.addEventListener("storage", updateLists);
        updateLists();
        return () => window.removeEventListener("storage", updateLists);
    }, []);

    // Update default filters if academic years change
    useEffect(() => {
        if (academicYears.length > 0 && !academicYears.includes(academicYear)) {
            setAcademicYear(academicYears[0]);
        }
    }, [academicYears]);

    // Student count by course (filtered by year and course)
    const filteredStudents = students.filter(s =>
        (reportFilters.academicYear ? s.academicYear === reportFilters.academicYear : true) &&
        (reportFilters.course === "All Courses" ? true : s.course === reportFilters.course)
    );
    const studentByCourse = courses.map(c =>
        students.filter(s =>
            (reportFilters.academicYear ? s.academicYear === reportFilters.academicYear : true) &&
            s.course === c
        ).length
    );

    // Faculty count by department
    const facultyByDept = departments.map(d =>
        faculty.filter(f => f.department === d).length
    );

    // Student report details table
    const studentDetails = courses.map(c => {
        const courseStudents = students.filter(s =>
            (reportFilters.academicYear ? s.academicYear === reportFilters.academicYear : true) &&
            s.course === c
        );
        const active = courseStudents.filter(s => s.status === "Active").length;
        const avgGpa =
            courseStudents.length > 0
                ? (
                    courseStudents.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) /
                    courseStudents.length
                ).toFixed(2)
                : "-";
        return {
            course: c,
            total: courseStudents.length,
            active,
            avgGpa
        };
    });

    // Faculty report details table
    const facultyDetails = departments.map(d => {
        const deptFaculty = faculty.filter(f => f.department === d);
        const professors = deptFaculty.filter(f => f.rank === "Professor").length;
        const associates = deptFaculty.filter(f => f.rank === "Associate" || f.rank === "Associate Professor").length;
        return {
            dept: d,
            total: deptFaculty.length,
            professors,
            associates
        };
    });

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
                    "#4ade80",
                    "#a855f7",
                    "#f472b6"
                ]
            }
        ]
    };

    // GPA calculation (overall)
    const avgGPA =
        filteredStudents.length > 0
            ? (
                filteredStudents.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) /
                filteredStudents.length
            ).toFixed(2)
            : "0.00";

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
                <button
                    style={{
                        background: "#a855f7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        fontWeight: "bold",
                        marginLeft: "auto"
                    }}
                    onClick={() => setReportFilters({
                        reportType,
                        course,
                        academicYear
                    })}
                >Generate Report</button>
                <button
                    style={{
                        background: "#23234a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 20px",
                        fontWeight: "bold",
                        marginLeft: "8px"
                    }}
                >Download</button>
            </div>
            <div className="report-stats" style={{
                display: "flex",
                gap: "32px",
                margin: "32px 0"
            }}>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-user-graduate" style={{ fontSize: "32px", color: "#3b82f6" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>{filteredStudents.length}</div>
                    <div>Total Students</div>
                    <div style={{ color: "#22c55e", fontSize: "13px" }}>↑ +12.5%</div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-user-tie" style={{ fontSize: "32px", color: "#22d3ee" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>{faculty.length}</div>
                    <div>Total Faculty</div>
                    <div style={{ color: "#22c55e", fontSize: "13px" }}>↑ +3.1%</div>
                </div>
                <div className="stat-card" style={statCardStyle}>
                    <i className="fas fa-file-alt" style={{ fontSize: "32px", color: "#a855f7" }}></i>
                    <div style={{ fontSize: "32px", fontWeight: "bold" }}>{avgGPA}</div>
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
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { ticks: { color: "#fff" } },
                            y: { ticks: { color: "#fff" } }
                        }
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

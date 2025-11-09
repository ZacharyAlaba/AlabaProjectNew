import React, { useEffect, useMemo, useRef, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// ---------- Data helpers ----------
function getActiveCourses() {
  const stored = localStorage.getItem("courses");
  if (!stored) return [];
  try {
    return JSON.parse(stored).filter(c => c.status === "Active").map(c => c.name);
  } catch { return []; }
}
function getActiveDepartments() {
  const stored = localStorage.getItem("departments");
  if (!stored) return [];
  try {
    return JSON.parse(stored).filter(d => d.status === "Active").map(d => d.name);
  } catch { return []; }
}
function getAcademicYears() {
  const stored = localStorage.getItem("academicYears");
  if (!stored) return [];
  try {
    return JSON.parse(stored).map(y => y.name);
  } catch { return []; }
}
function getStudents() {
  const stored = localStorage.getItem("students");
  if (!stored) return [];
  try { return JSON.parse(stored); } catch { return []; }
}
function getFaculty() {
  const stored = localStorage.getItem("faculty");
  if (!stored) return [];
  try { return JSON.parse(stored); } catch { return []; }
}

// ---------- Component ----------
export default function Reports() {
  // Filters
  const [reportType, setReportType] = useState("Student Report");
  const [course, setCourse] = useState("All Courses");
  const [academicYear, setAcademicYear] = useState("");

  // Master data
  const [courses, setCourses] = useState(getActiveCourses());
  const [departments, setDepartments] = useState(getActiveDepartments());
  const [academicYears, setAcademicYears] = useState(getAcademicYears());
  const [students, setStudents] = useState(getStudents());
  const [faculty, setFaculty] = useState(getFaculty());

  // Report state
  const [generatedAt, setGeneratedAt] = useState(null);
  const [reportId, setReportId] = useState("");
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  // Keep lists in sync if localStorage changes
  useEffect(() => {
    function refresh() {
      setCourses(getActiveCourses());
      setDepartments(getActiveDepartments());
      setAcademicYears(getAcademicYears());
      setStudents(getStudents());
      setFaculty(getFaculty());
    }
    window.addEventListener("storage", refresh);
    refresh();
    return () => window.removeEventListener("storage", refresh);
  }, []);

  useEffect(() => {
    if (academicYears.length && !academicYears.includes(academicYear)) {
      setAcademicYear(academicYears[0]);
    }
  }, [academicYears]);

  // Derived filters
  const activeFilters = useMemo(() => ({
    reportType,
    course,
    academicYear: academicYear?.trim() || ""
  }), [reportType, course, academicYear]);

  // Students filtered by year & course
  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      (activeFilters.academicYear ? (s.academicYear || "").trim() === activeFilters.academicYear : true) &&
      (activeFilters.course === "All Courses" ? true : s.course === activeFilters.course)
    );
  }, [students, activeFilters]);

  // NEW: Faculty filtered by year (only restrict if a year is chosen)
  const filteredFaculty = useMemo(() => {
    return faculty.filter(f =>
      (activeFilters.academicYear ? (f.academicYear || "").trim() === activeFilters.academicYear : true)
    );
  }, [faculty, activeFilters]);

  // Student counts by course (respect filters)
  const studentByCourse = useMemo(() => {
    return courses.map(c =>
      students.filter(s =>
        (activeFilters.academicYear ? (s.academicYear || "").trim() === activeFilters.academicYear : true) &&
        s.course === c
      ).length
    );
  }, [students, courses, activeFilters]);

  // Faculty counts by department (respect academic year)
  const facultyByDept = useMemo(() => {
    return departments.map(d =>
      filteredFaculty.filter(f => f.department === d).length
    );
  }, [departments, filteredFaculty]);

  // Student table rows
  const studentDetails = useMemo(() => {
    return courses.map(c => {
      const list = students.filter(s =>
        (activeFilters.academicYear ? (s.academicYear || "").trim() === activeFilters.academicYear : true) &&
        s.course === c
      );
      const active = list.filter(s => s.status === "Active").length;
      const graduated = list.filter(s => s.status === "Graduated").length;
      const avgGpa = list.length
        ? (list.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / list.length).toFixed(2)
        : "-";
      return { course: c, total: list.length, active, graduated, avgGpa };
    });
  }, [students, courses, activeFilters]);

  // Faculty table rows (respect academic year)
  const facultyDetails = useMemo(() => {
    return departments.map(d => {
      const list = filteredFaculty.filter(f => f.department === d);
      const professors = list.filter(f => f.rank === "Professor").length;
      const associates = list.filter(f => /Associate/i.test(f.rank)).length;
      const assistants = list.filter(f => /Assistant/i.test(f.rank)).length;
      return { dept: d, total: list.length, professors, associates, assistants };
    });
  }, [departments, filteredFaculty]);

  // Five-year trends (per-year faculty counts now)
  const trendRows = useMemo(() => {
    const years = academicYears.slice(0, 5);
    return years.map((yr, idx, arr) => {
      const totalStudents = students.filter(s => (s.academicYear || "").trim() === yr).length;
      const totalFaculty = faculty.filter(f => (f.academicYear || "").trim() === yr).length;
      const ratio = totalFaculty ? (totalStudents / totalFaculty).toFixed(2) : "—";
      let yoy = "—";
      if (idx > 0) {
        const prevStudents = students.filter(s => (s.academicYear || "").trim() === arr[idx - 1]).length;
        if (prevStudents) {
          yoy = (((totalStudents - prevStudents) / prevStudents) * 100).toFixed(1) + "%";
        }
      }
      return { year: yr, students: totalStudents, faculty: totalFaculty, ratio, yoy };
    });
  }, [academicYears, students, faculty]);

  // Average GPA (filtered)
  const avgGPA = useMemo(() => {
    return filteredStudents.length
      ? (filteredStudents.reduce((s, r) => s + (parseFloat(r.gpa) || 0), 0) / filteredStudents.length).toFixed(2)
      : "0.00";
  }, [filteredStudents]);

  // Charts (use filtered faculty/students where appropriate)
  const barData = useMemo(() => ({
    labels: courses,
    datasets: [{ label: "Students", data: studentByCourse, backgroundColor: "#8b5cf6" }]
  }), [courses, studentByCourse]);

  const pieData = useMemo(() => ({
    labels: departments,
    datasets: [{ label: "Faculty", data: facultyByDept, backgroundColor: ["#a855f7","#6366f1","#f59e0b","#10b981","#ec4899","#3b82f6","#f87171"] }]
  }), [departments, facultyByDept]);

  // Actions
  const generateReport = () => {
    const id = `RPT-${new Date().getFullYear()}-${reportType === "Student Report" ? "STUDENTS" : "FACULTY"}-${Math.floor(Math.random()*900+100)}`;
    setReportId(id);
    setGeneratedAt(new Date().toISOString());
    // optional: persist metadata
    localStorage.setItem("lastReportMeta", JSON.stringify({
      id, reportType, course, academicYear, generatedAt: new Date().toLocaleString()
    }));
    // scroll to report
    setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const downloadPDF = async () => {
    if (!reportRef.current || !generatedAt) return;
    setDownloading(true);
    try {
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;
      if (!html2canvas || !jsPDF) throw new Error("Libraries not loaded");

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#0f1020"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `${reportId || "report"}_${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(filename);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // ---------- Styles ----------
  const pagePad = { padding: "32px" };
  const panel = { background: "#121225", borderRadius: "14px", padding: "20px", color: "#fff" };
  const purpleHeader = { background: "#8b5cf6", color: "#fff", fontWeight: 600 };
  const tableBase = { width: "100%", borderCollapse: "collapse", fontSize: "14px", background: "#181826", borderRadius: "12px", overflow: "hidden" };
  const thTd = { padding: "10px 14px", borderBottom: "1px solid #23234a", textAlign: "left" };
  const statCard = { background: "#181826", padding: "18px 20px", borderRadius: "16px", flex: 1, color: "#fff", display: "flex", flexDirection: "column", gap: "6px", position: "relative", minWidth: 220 };
  const badge = { fontSize: "11px", padding: "2px 8px", background: "#23234a", borderRadius: "999px", letterSpacing: ".5px" };
  const filterStyle = { background: "#23234a", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "14px", minWidth: "160px" };
  const primaryBtn = { background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" };
  const ghostBtn = { background: "#23234a", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" };

  return (
    <div className="reports-content" style={pagePad}>
      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", background: "#181826", padding: "16px 20px", borderRadius: "14px", marginBottom: "24px" }}>
        <select value={reportType} onChange={e => setReportType(e.target.value)} style={filterStyle}>
          <option>Student Report</option>
          <option>Faculty Report</option>
        </select>
        <select value={course} onChange={e => setCourse(e.target.value)} style={filterStyle}>
          <option>All Courses</option>
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={academicYear} onChange={e => setAcademicYear(e.target.value)} style={filterStyle}>
          <option value="">All Academic Years</option>
          {academicYears.map(y => <option key={y}>{y}</option>)}
        </select>
        <button onClick={generateReport} style={primaryBtn}>Generate</button>
        <button onClick={downloadPDF} style={{ ...ghostBtn, opacity: generatedAt ? 1 : 0.6, pointerEvents: generatedAt ? "auto" : "none" }}>
          {downloading ? "Preparing…" : "Download"}
        </button>
      </div>

      {/* REPORT CONTENT (captured to PDF) */}
      <div ref={reportRef}>
        {/* Formal Header */}
        <div style={{ ...panel, padding: "28px 32px", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                <div style={{ width: "44px", height: "44px", background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontWeight: 700, fontSize: "18px" }}>EI</div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 600 }}>ZJ University</div>
                  <div style={{ fontSize: "12px", opacity: .7 }}>Student & Faculty Management System</div>
                </div>
              </div>
              <h3 style={{ margin: 0, color: "#8b5cf6" }}>
                {reportType === "Student Report" ? "Student Enrollment Report" : "Faculty Distribution Report"}
              </h3>
            </div>
            <div style={{ fontSize: "13px", lineHeight: "1.4", textAlign: "right" }}>
              <div><b>Report ID:</b> {reportId || "—"}</div>
              <div><b>Report Date:</b> {new Date().toLocaleDateString()}</div>
              <div><b>Academic Year:</b> {academicYear || "All / Multi-Year"}</div>
              <div><b>Prepared By:</b> Office of Institutional Research</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <h4 style={{ color: "#8b5cf6", margin: "0 0 12px" }}>Executive Summary</h4>
        <div style={{ display: "flex", gap: "22px", marginBottom: "34px", flexWrap: "wrap" }}>
          <div style={statCard}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>Total Students</div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>{filteredStudents.length}</div>
            <div style={{ color: "#22c55e", fontSize: "12px" }}>↑ Growth Trend</div>
            <span style={badge}>STUDENTS</span>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>Total Faculty</div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>{filteredFaculty.length}</div>
            <div style={{ color: "#22c55e", fontSize: "12px" }}>↑ Stable Expansion</div>
            <span style={badge}>FACULTY</span>
          </div>
          <div style={statCard}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>Average GPA</div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>{avgGPA}</div>
            <div style={{ color: "#22c55e", fontSize: "12px" }}>↑ Slight Improvement</div>
            <span style={badge}>ACADEMICS</span>
          </div>
        </div>

        {/* Tables Row */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "380px" }}>
            <h4 style={{ margin: "0 0 10px", color: "#fff" }}>Student Enrollment by Course</h4>
            <table style={tableBase}>
              <thead>
                <tr style={purpleHeader}>
                  <th style={thTd}>Course Program</th>
                  <th style={thTd}>Total Enrolled</th>
                  <th style={thTd}>Active Students</th>
                  <th style={thTd}>Graduated</th>
                  <th style={thTd}>Average GPA</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.map(r => (
                  <tr key={r.course}>
                    <td style={thTd}>{r.course}</td>
                    <td style={thTd}>{r.total}</td>
                    <td style={thTd}>{r.active}</td>
                    <td style={thTd}>{r.graduated}</td>
                    <td style={thTd}>{r.avgGpa}</td>
                  </tr>
                ))}
                <tr style={{ background: "#23234a", fontWeight: 600 }}>
                  <td style={thTd}>TOTAL</td>
                  <td style={thTd}>{studentDetails.reduce((s, r) => s + r.total, 0)}</td>
                  <td style={thTd}>{studentDetails.reduce((s, r) => s + r.active, 0)}</td>
                  <td style={thTd}>{studentDetails.reduce((s, r) => s + r.graduated, 0)}</td>
                  <td style={thTd}>
                    {(() => {
                      const g = studentDetails.filter(r => r.avgGpa !== "-").map(r => parseFloat(r.avgGpa));
                      return g.length ? (g.reduce((s, v) => s + v, 0) / g.length).toFixed(2) : "-";
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ flex: 1, minWidth: "380px" }}>
            <h4 style={{ margin: "0 0 10px", color: "#fff" }}>Faculty Distribution by Department</h4>
            <table style={tableBase}>
              <thead>
                <tr style={purpleHeader}>
                  <th style={thTd}>Department</th>
                  <th style={thTd}>Total Faculty</th>
                  <th style={thTd}>Professors</th>
                  <th style={thTd}>Associate Professors</th>
                  <th style={thTd}>Assistant Professors</th>
                </tr>
              </thead>
              <tbody>
                {facultyDetails.map(r => (
                  <tr key={r.dept}>
                    <td style={thTd}>{r.dept}</td>
                    <td style={thTd}>{r.total}</td>
                    <td style={thTd}>{r.professors}</td>
                    <td style={thTd}>{r.associates}</td>
                    <td style={thTd}>{r.assistants}</td>
                  </tr>
                ))}
                <tr style={{ background: "#23234a", fontWeight: 600 }}>
                  <td style={thTd}>TOTAL</td>
                  <td style={thTd}>{facultyDetails.reduce((s, r) => s + r.total, 0)}</td>
                  <td style={thTd}>{facultyDetails.reduce((s, r) => s + r.professors, 0)}</td>
                  <td style={thTd}>{facultyDetails.reduce((s, r) => s + r.associates, 0)}</td>
                  <td style={thTd}>{facultyDetails.reduce((s, r) => s + r.assistants, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "48px" }}>
          <div style={{ flex: 1, minWidth: "380px", ...panel }}>
            <h4 style={{ marginTop: 0 }}>Students by Course</h4>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#fff" } },
                  y: { ticks: { color: "#fff" } }
                }
              }}
              height={220}
            />
          </div>
          <div style={{ flex: 1, minWidth: "380px", ...panel }}>
            <h4 style={{ marginTop: 0 }}>Faculty by Department</h4>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom", labels: { color: "#fff" } } }
              }}
              height={220}
            />
          </div>
        </div>

        {/* Trend table */}
        <h4 style={{ color: "#fff", margin: "0 0 12px" }}>Five-Year Enrollment Trends</h4>
        <table style={{ ...tableBase, marginBottom: "42px" }}>
          <thead>
            <tr style={purpleHeader}>
              <th style={thTd}>Academic Year</th>
              <th style={thTd}>Total Students</th>
              <th style={thTd}>Total Faculty</th>
              <th style={thTd}>Student-Faculty Ratio</th>
              <th style={thTd}>YoY Growth %</th>
            </tr>
          </thead>
          <tbody>
            {trendRows.map(r => (
              <tr key={r.year}>
                <td style={thTd}>{r.year}</td>
                <td style={thTd}>{r.students}</td>
                <td style={thTd}>{r.faculty}</td>
                <td style={thTd}>{r.ratio}</td>
                <td style={{ ...thTd, color: r.yoy.startsWith("-") ? "#f87171" : (r.yoy === "—" ? "#fff" : "#22c55e") }}>{r.yoy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Findings */}
        <h4 style={{ color: "#fff", margin: "0 0 16px" }}>Key Findings & Recommendations</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "54px" }}>
          <FindingCard icon="fa-chart-line" title="Enrollment Growth" color="#8b5cf6"
            text="Institution shows consistent growth with positive year-over-year student enrollment, indicating strong academic appeal and retention strategy." />
          <FindingCard icon="fa-users" title="Faculty Expansion" color="#6366f1"
            text="Faculty headcount maintains a healthy student-faculty ratio supporting efficient delivery and personalized academic support." />
          <FindingCard icon="fa-graduation-cap" title="Academic Excellence" color="#10b981"
            text="Average GPA trends remain stable with incremental improvement—suggests effective curriculum oversight and assessment integrity." />
          <RecommendationCard items={[
            "Prioritize hiring in high-demand programs (e.g., Computer Science, Engineering).",
            "Continue monitoring student-faculty ratios to maintain quality standards.",
            "Expand support programs for courses with lower GPA averages.",
            "Invest in analytics for early identification of at-risk students."
          ]} />
        </div>

        {/* Footer */}
        <div style={{ fontSize: "11px", opacity: .75, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderTop: "1px solid #23234a", paddingTop: "18px" }}>
          <div>
            © {new Date().getFullYear()} ZJ University. All rights reserved.<br />
            Confidential report. Distribution limited to authorized personnel only.
          </div>
          <div style={{ textAlign: "right" }}>
            Report ID: {reportId || "—"}<br />
            Classification: Internal Use Only
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Small subcomponents ----------
function FindingCard({ icon, title, text, color }) {
  return (
    <div style={{ background: "#181826", padding: "16px 18px", borderRadius: "12px", color: "#fff", display: "flex", gap: "14px", alignItems: "flex-start" }}>
      <div style={{ width: "34px", height: "34px", background: color, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
        <i className={`fas ${icon}`} style={{ color: "#fff" }}></i>
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "13px", lineHeight: "1.4", opacity: .85 }}>{text}</div>
      </div>
    </div>
  );
}

function RecommendationCard({ items }) {
  return (
    <div style={{ background: "#181826", padding: "16px 18px 18px", border: "1px solid #8b5cf6", borderRadius: "12px", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <div style={{ width: "34px", height: "34px", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
          <i className="fas fa-lightbulb" style={{ color: "#000" }}></i>
        </div>
        <div style={{ fontWeight: 600 }}>Recommendations</div>
      </div>
      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", lineHeight: "1.5" }}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

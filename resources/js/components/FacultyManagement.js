import React, { useState, useRef, useEffect } from "react";

const sampleFaculty = [
    {
        id: "FAC-2015-001",
        name: "Dr. Emily Wilson",
        position: "Professor",
        department: "Computer Science",
        email: "emily.wilson@university.edu",
        phone: "+1 (555) 111-2222",
        joined: "2015-08-20",
        specialization: "Artificial Intelligence and Machine Learning",
        status: "ACTIVE"
    },
    {
        id: "FAC-2018-005",
        name: "Prof. David Martinez",
        position: "Associate Professor",
        department: "Business",
        email: "david.martinez@university.edu",
        phone: "+1 (555) 333-4444",
        joined: "2018-01-15",
        specialization: "Strategic Management and Organizational Behavior",
        status: "ACTIVE"
    }
];

function getInitialFaculty() {
    const stored = localStorage.getItem("faculty");
    return stored ? JSON.parse(stored) : sampleFaculty;
}

export default function FacultyManagement() {
    const [faculty, setFaculty] = useState(getInitialFaculty());
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [editFaculty, setEditFaculty] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const menuRef = useRef(null);

    // Persist faculty to localStorage
    useEffect(() => {
        localStorage.setItem("faculty", JSON.stringify(faculty));
    }, [faculty]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpenId(null);
            }
        }
        if (menuOpenId) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpenId]);

    // Add faculty handler
    const handleAddFaculty = (newFaculty) => {
        setFaculty([...faculty, newFaculty]);
        setShowAddModal(false);
    };

    // Delete faculty handler
    const handleDeleteFaculty = (id) => {
        setFaculty(faculty.filter(f => f.id !== id));
        setMenuOpenId(null);
        setSelectedFaculty(null);
    };

    // Edit faculty handler
    const handleEditFaculty = (fac) => {
        setEditFaculty(fac);
        setShowEditModal(true);
        setMenuOpenId(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setFaculty(faculty.map(f => f.id === editFaculty.id ? editFaculty : f));
        setShowEditModal(false);
        setEditFaculty(null);
    };

    // Filter faculty
    const filteredFaculty = faculty.filter(fac =>
        departmentFilter === "All Departments" ||
        (fac.department && fac.department.toLowerCase().includes(departmentFilter.toLowerCase()))
    );

    return (
        <div className="faculty-management-content">
            <header className="top-bar">
                <h1>Faculty</h1>
                <input type="search" placeholder="Search faculty by name, email, or department..." />
                <i className="fas fa-bell notification"></i>
                <div className="user-info">
                    <i className="fas fa-circle user-status online"></i>
                    <span>AU Admin User... ONLINE</span>
                </div>
                <button className="add-student-btn" onClick={() => setShowAddModal(true)}>+ Add Faculty</button>
            </header>
            <section className="dashboard-header">
                <h2>Faculty Management</h2>
                <p>Manage faculty profiles and academic staff</p>
            </section>
            <section className="filters">
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                    <option value="All Departments">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                </select>
            </section>
            <section className="students-grid">
                {filteredFaculty.map((fac) => (
                    <div className="student-card" key={fac.id} style={{ position: "relative" }}>
                        <div className="student-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span className="initials">
                                {fac.name.split(' ').map(n => n[0]).join('')}
                            </span>
                            <span className="status" style={{
                                background: "#a855f7",
                                color: "#fff",
                                borderRadius: "12px",
                                padding: "2px 10px",
                                fontSize: "12px",
                                marginLeft: "8px"
                            }}>{fac.status}</span>
                            {/* Three-dot menu */}
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
                                onClick={() => setMenuOpenId(fac.id)}
                                aria-label="Open menu"
                            >
                                &#8942;
                            </button>
                            {/* Dropdown menu */}
                            {menuOpenId === fac.id && (
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
                                    <button className="menu-item" style={menuItemStyle} onClick={() => { setMenuOpenId(null); setSelectedFaculty(fac); }}>
                                        <i className="fas fa-eye"></i> View Details
                                    </button>
                                    <button className="menu-item" style={menuItemStyle} onClick={() => handleEditFaculty(fac)}>
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button className="menu-item" style={{ ...menuItemStyle, color: "#ef4444" }} onClick={() => handleDeleteFaculty(fac.id)}>
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <h3>{fac.name}</h3>
                        <p>{fac.position}</p>
                        <span className="badge" style={{
                            background: "#22c55e",
                            color: "#fff",
                            borderRadius: "8px",
                            padding: "2px 10px",
                            fontSize: "12px",
                            marginRight: "8px"
                        }}>{fac.department}</span>
                        <p><i className="fas fa-envelope"></i> {fac.email}</p>
                        <p><i className="fas fa-phone"></i> {fac.phone}</p>
                        <p><i className="fas fa-calendar"></i> Joined {fac.joined}</p>
                        <p>ID: {fac.id}</p>
                        <div style={{ borderTop: "1px solid #333", margin: "10px 0" }}></div>
                        <div>
                            <span style={{ fontWeight: "bold", fontSize: "13px" }}>Specialization:</span>
                            <br />
                            <span style={{ fontSize: "13px" }}>{fac.specialization}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Faculty Details Modal */}
            {selectedFaculty && (
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
                            onClick={() => setSelectedFaculty(null)}
                        >×</button>
                        <h2>{selectedFaculty.name}</h2>
                        <p>Position: {selectedFaculty.position}</p>
                        <p>Department: {selectedFaculty.department}</p>
                        <p>Email: {selectedFaculty.email}</p>
                        <p>Phone: {selectedFaculty.phone}</p>
                        <p>Joined: {selectedFaculty.joined}</p>
                        <p>ID: {selectedFaculty.id}</p>
                        <p>Specialization: {selectedFaculty.specialization}</p>
                        <p>Status: {selectedFaculty.status}</p>
                    </div>
                </div>
            )}

            {/* Edit Faculty Modal */}
            {showEditModal && editFaculty && (
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
                        <h2>Edit Faculty</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input name="name" placeholder="Full Name" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.name}
                                onChange={e => setEditFaculty({ ...editFaculty, name: e.target.value })} />
                            <input name="position" placeholder="Position" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.position}
                                onChange={e => setEditFaculty({ ...editFaculty, position: e.target.value })} />
                            <select name="department" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.department}
                                onChange={e => setEditFaculty({ ...editFaculty, department: e.target.value })}>
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Business">Business</option>
                            </select>
                            <input name="email" placeholder="Email" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.email}
                                onChange={e => setEditFaculty({ ...editFaculty, email: e.target.value })} />
                            <input name="phone" placeholder="Phone" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.phone}
                                onChange={e => setEditFaculty({ ...editFaculty, phone: e.target.value })} />
                            <input name="joined" placeholder="Joined (YYYY-MM-DD)" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.joined}
                                onChange={e => setEditFaculty({ ...editFaculty, joined: e.target.value })} />
                            <input name="id" placeholder="Faculty ID" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.id}
                                onChange={e => setEditFaculty({ ...editFaculty, id: e.target.value })} />
                            <input name="specialization" placeholder="Specialization" required style={{ width: "100%", marginBottom: "8px" }}
                                value={editFaculty.specialization}
                                onChange={e => setEditFaculty({ ...editFaculty, specialization: e.target.value })} />
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

            {/* Add Faculty Modal */}
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
                        <h2>Add New Faculty</h2>
                        <form onSubmit={e => {
                            e.preventDefault();
                            const form = e.target;
                            const newFaculty = {
                                name: form.name.value,
                                position: form.position.value,
                                department: form.department.value,
                                email: form.email.value,
                                phone: form.phone.value,
                                joined: form.joined.value,
                                id: form.id.value,
                                specialization: form.specialization.value,
                                status: "ACTIVE"
                            };
                            handleAddFaculty(newFaculty);
                        }}>
                            <input name="name" placeholder="Full Name" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="position" placeholder="Position" required style={{ width: "100%", marginBottom: "8px" }} />
                            <select name="department" required style={{ width: "100%", marginBottom: "8px" }}>
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Business">Business</option>
                            </select>
                            <input name="email" placeholder="Email" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="phone" placeholder="Phone" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="joined" placeholder="Joined (YYYY-MM-DD)" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="id" placeholder="Faculty ID" required style={{ width: "100%", marginBottom: "8px" }} />
                            <input name="specialization" placeholder="Specialization" required style={{ width: "100%", marginBottom: "8px" }} />
                            <button type="submit" style={{
                                background: "#a855f7",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 24px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                marginTop: "12px"
                            }}>Add Faculty</button>
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
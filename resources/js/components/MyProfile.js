import React, { useState, useEffect, useRef } from "react";

const initialProfile = {
    name: "Admin User",
    position: "System Administrator",
    department: "Information Technology",
    employeeId: "ADM-2020-001",
    dateJoined: "2020-01-15",
    age: 40,
    email: "admin@university.edu",
    phone: "+1 (555) 123-0000",
    dob: "1985-06-15",
    address: "123 Admin Street, University City, ST 12345",
    bio: "Experienced system administrator with over 10 years in educational technology management. Passionate about creating efficient digital learning environments.",
    emergencyContact: {
        name: "Emergency Admin",
        phone: "+1 (555) 999-0000"
    },
    status: "ACTIVE",
    tags: ["INFORMATION TECHNOLOGY", "ADM-2020-001"],
    profileImage: null // <-- add this
};

export function getProfile() {
    const stored = localStorage.getItem("profile");
    return stored ? JSON.parse(stored) : initialProfile;
}

export default function MyProfile() {
    const [profile, setProfile] = useState(getProfile());
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(profile);
    const fileInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("profile", JSON.stringify(profile));
    }, [profile]);

    const handleEdit = () => {
        setForm(profile);
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = () => {
        // Remove any previous employeeId from tags and add the new one (only once)
        const filteredTags = form.tags.filter(
            tag => tag !== profile.employeeId && tag !== form.employeeId
        );
        // Find any tag that looks like an employee ID (starts with ADM- or ALABA- etc)
        const tagsWithoutEmpId = filteredTags.filter(
            tag => !/^([A-Z]+-)?\d{4}-\d{3,}$/.test(tag)
        );
        const updatedTags = [...tagsWithoutEmpId, form.employeeId];
        setProfile({ ...form, tags: updatedTags });
        setEditing(false);
    };

    // Image upload handler
    const handleImageClick = () => {
        if (editing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                setForm({ ...form, profileImage: ev.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const inputStyle = {
        width: "100%",
        marginBottom: "8px",
        padding: "8px",
        borderRadius: "8px",
        border: "none",
        background: "#23234a",
        color: "#fff",
        fontSize: "15px"
    };

    return (
        <div style={{ padding: "32px" }}>
            <h2 style={{ color: "#a855f7" }}>My Profile</h2>
            <p>Manage your account settings and personal information</p>
            {editing && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "16px" }}>
                    <button
                        style={{
                            background: "#23234a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 20px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                        onClick={handleCancel}
                    >Cancel</button>
                    <button
                        style={{
                            background: "#a855f7",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 20px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                        onClick={handleSave}
                    >Save Changes</button>
                </div>
            )}
            <div style={{
                display: "flex",
                gap: "32px",
                marginTop: "32px",
                marginBottom: "32px"
            }}>
                <div style={{
                    background: "#181826",
                    borderRadius: "16px",
                    padding: "32px",
                    color: "#fff",
                    minWidth: "420px",
                    flex: 1
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "18px", position: "relative" }}>
                        <div style={{
                            position: "relative",
                            width: "72px",
                            height: "72px"
                        }}>
                            {((editing ? form.profileImage : profile.profileImage)) ? (
                                <img
                                    src={editing ? form.profileImage : profile.profileImage}
                                    alt="Profile"
                                    style={{
                                        width: "72px",
                                        height: "72px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        background: "#a855f7"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    background: "#a855f7",
                                    borderRadius: "50%",
                                    width: "72px",
                                    height: "72px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "28px",
                                    fontWeight: "bold",
                                    color: "#fff"
                                }}>
                                    {(editing ? form.name : profile.name).split(' ').map(n => n[0]).join('')}
                                </div>
                            )}
                            {/* Camera icon */}
                            <div
                                onClick={handleImageClick}
                                style={{
                                    position: "absolute",
                                    right: "-8px",
                                    bottom: "-8px",
                                    background: "#a855f7",
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: editing ? "pointer" : "not-allowed",
                                    border: "3px solid #181826"
                                }}
                                title={editing ? "Change Profile Image" : ""}
                            >
                                <i className="fas fa-camera" style={{ color: "#fff", fontSize: "16px" }}></i>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: "bold", fontSize: "22px" }}>
                                {editing ? (
                                    <input
                                        style={inputStyle}
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                ) : profile.name}
                            </div>
                            <div style={{ fontSize: "15px", color: "#a3a3a3" }}>
                                {editing ? (
                                    <input
                                        style={inputStyle}
                                        value={form.position}
                                        onChange={e => setForm({ ...form, position: e.target.value })}
                                    />
                                ) : profile.position}
                            </div>
                            <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{
                                    background: "#22c55e",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "2px 10px",
                                    fontSize: "13px"
                                }}>{profile.status}</span>
                                {profile.tags.map(tag => (
                                    <span key={tag} style={{
                                        background: "#23234a",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 10px",
                                        fontSize: "13px"
                                    }}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: "18px", color: "#a3a3a3", fontSize: "15px" }}>
                        <i className="fas fa-envelope"></i>{" "}
                        {editing ? (
                            <input
                                style={inputStyle}
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        ) : profile.email}
                        &nbsp;&nbsp;
                        <i className="fas fa-phone"></i>{" "}
                        {editing ? (
                            <input
                                style={inputStyle}
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        ) : profile.phone}
                        &nbsp;&nbsp;
                        <i className="fas fa-calendar"></i>{" "}
                        {editing ? (
                            <input
                                style={inputStyle}
                                type="date"
                                value={form.dateJoined}
                                onChange={e => setForm({ ...form, dateJoined: e.target.value })}
                            />
                        ) : `Joined ${profile.dateJoined}`}
                        &nbsp;&nbsp;
                        <i className="fas fa-user"></i>{" "}
                        {editing ? (
                            <input
                                style={inputStyle}
                                type="number"
                                value={form.age}
                                onChange={e => setForm({ ...form, age: e.target.value })}
                            />
                        ) : `Age: ${profile.age}`}
                    </div>
                    <div style={{ marginTop: "18px", fontStyle: "italic", color: "#fff", fontSize: "15px" }}>
                        {editing ? (
                            <textarea
                                style={{ ...inputStyle, minHeight: "60px" }}
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                            />
                        ) : `"${profile.bio}"`}
                    </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                gap: "32px",
                marginBottom: "32px"
            }}>
                <div style={{
                    background: "#181826",
                    borderRadius: "16px",
                    padding: "24px",
                    color: "#fff",
                    minWidth: "320px",
                    flex: 1
                }}>
                    <h4 style={{ color: "#a855f7" }}>
                        <i className="fas fa-user"></i> Personal Information
                    </h4>
                    <div style={infoRow}><b>Full Name:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    ) : profile.name}</div>
                    <div style={infoRow}><b>Email Address:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    ) : profile.email}</div>
                    <div style={infoRow}><b>Phone Number:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    ) : profile.phone}</div>
                    <div style={infoRow}><b>Date of Birth:</b> {editing ? (
                        <input
                            style={inputStyle}
                            type="date"
                            value={form.dob}
                            onChange={e => setForm({ ...form, dob: e.target.value })}
                        />
                    ) : `${profile.dob} (${profile.age} years old)`}</div>
                    <div style={infoRow}><b>Address:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                        />
                    ) : profile.address}</div>
                </div>
                <div style={{
                    background: "#181826",
                    borderRadius: "16px",
                    padding: "24px",
                    color: "#fff",
                    minWidth: "320px",
                    flex: 1
                }}>
                    <h4 style={{ color: "#a855f7" }}>
                        <i className="fas fa-briefcase"></i> Professional Information
                    </h4>
                    <div style={infoRow}><b>Position:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.position}
                            onChange={e => setForm({ ...form, position: e.target.value })}
                        />
                    ) : profile.position}</div>
                    <div style={infoRow}><b>Department:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.department}
                            onChange={e => setForm({ ...form, department: e.target.value })}
                        />
                    ) : profile.department}</div>
                    <div style={infoRow}><b>Employee ID:</b> {editing ? (
                        <input
                            style={inputStyle}
                            value={form.employeeId}
                            onChange={e => setForm({ ...form, employeeId: e.target.value })}
                        />
                    ) : profile.employeeId}</div>
                    <div style={infoRow}><b>Date Joined:</b> {editing ? (
                        <input
                            style={inputStyle}
                            type="date"
                            value={form.dateJoined}
                            onChange={e => setForm({ ...form, dateJoined: e.target.value })}
                        />
                    ) : profile.dateJoined}</div>
                    <div style={infoRow}><b>Bio:</b> {editing ? (
                        <textarea
                            style={{ ...inputStyle, minHeight: "60px" }}
                            value={form.bio}
                            onChange={e => setForm({ ...form, bio: e.target.value })}
                        />
                    ) : profile.bio}</div>
                </div>
            </div>
            <div style={{
                background: "#181826",
                borderRadius: "16px",
                padding: "24px",
                color: "#fff",
                minWidth: "320px",
                maxWidth: "600px"
            }}>
                <h4 style={{ color: "#ef4444" }}>
                    <i className="fas fa-phone"></i> Emergency Contact
                </h4>
                <div style={infoRow}><b>Emergency Contact Name:</b> {editing ? (
                    <input
                        style={inputStyle}
                        value={form.emergencyContact.name}
                        onChange={e => setForm({
                            ...form,
                            emergencyContact: {
                                ...form.emergencyContact,
                                name: e.target.value
                            }
                        })}
                    />
                ) : profile.emergencyContact.name}</div>
                <div style={infoRow}><b>Emergency Phone:</b> {editing ? (
                    <input
                        style={inputStyle}
                        value={form.emergencyContact.phone}
                        onChange={e => setForm({
                            ...form,
                            emergencyContact: {
                                ...form.emergencyContact,
                                phone: e.target.value
                            }
                        })}
                    />
                ) : profile.emergencyContact.phone}</div>
            </div>
            {!editing && (
                <button style={{
                    background: "#a855f7",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 24px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "32px",
                    float: "right"
                }}
                    onClick={handleEdit}
                >
                    <i className="fas fa-edit"></i> Edit Profile
                </button>
            )}
        </div>
    );
}

const infoRow = {
    margin: "8px 0",
    fontSize: "15px"
};
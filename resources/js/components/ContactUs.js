import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ContactUs() {
    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        axios.get("/api/contacts").then(res => setContacts(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId !== null) {
            const res = await axios.put(`/api/contacts/${editId}`, form);
            setContacts(contacts.map(c => c.id === editId ? res.data : c));
            setEditId(null);
        } else {
            const res = await axios.post("/api/contacts", form);
            setContacts([...contacts, res.data]);
        }
        setForm({ first_name: "", last_name: "", email: "", message: "" });
    };

    const handleEdit = (id) => {
        const contact = contacts.find(c => c.id === id);
        setForm({
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            message: contact.message
        });
        setEditId(id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/contacts/${id}`);
        setContacts(contacts.filter(c => c.id !== id));
        if (editId === id) setEditId(null);
    };

    return (
        <>
            <div className="contactus-page custom-bg">
                <h2>Contact Us</h2>
                <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <div style={{ flex: 1 }}>
                            <label>First Name</label>
                            <input name="first_name" value={form.first_name} onChange={handleChange} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Last Name</label>
                            <input name="last_name" value={form.last_name} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Message</label>
                        <textarea name="message" value={form.message} onChange={handleChange} required />
                    </div>
                    <button type="submit">{editId !== null ? "Update" : "Submit"}</button>
                </form>
                
                {/* Add this heading below the form */}
                <h3 style={{ margin: "24px 0 12px 0", fontWeight: "600", color: "#343a40" }}>Contact Messages</h3>
                
                <table className="contact-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.id}>
                                <td>{contact.id}</td>
                                <td>{contact.first_name}</td>
                                <td>{contact.last_name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.message}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(contact.id)}>EDIT</button>
                                </td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDelete(contact.id)}>DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Footer outside the centered container */}
            <footer className="contactus-footer">
    <div className="footer-center">
        <div><strong>Father Saturnino Urios University</strong></div>
        <div>📞 (09)123-4567</div>      
        <div>✉️ info@urios.edu.ph</div>
        <div>📍 Butuan City, Philippines</div>
        <div>🕒 Monday – Friday: 8:00 am – 5:00 pm</div>
    </div>
    <div className="footer-credit">
        Design by Zachary Alaba
    </div>
</footer>
        </>
    );
}
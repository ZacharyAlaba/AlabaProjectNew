import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Add defaults + a helper to read/write credentials
const DEFAULT_EMAIL = "zachary.alaba@urios.edu.ph";
const DEFAULT_PASSWORD = "Janacute123";

function getAuth() {
    let email = localStorage.getItem("authEmail");
    let password = localStorage.getItem("authPassword");
    if (!email) {
        email = DEFAULT_EMAIL;
        localStorage.setItem("authEmail", email);
    }
    if (!password) {
        password = DEFAULT_PASSWORD;
        localStorage.setItem("authPassword", password);
    }
    return { email, password };
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const { email: storedEmail, password: storedPassword } = getAuth();

        if (email === storedEmail && password === storedPassword) {
            navigate("/admin");
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="nav-login">
            <img
                src="/images/fsuu-logo.png"
                alt="FSUU Logo"
                className="login-logo"
                style={{ width: "100px", marginBottom: "20px" }}
            />
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
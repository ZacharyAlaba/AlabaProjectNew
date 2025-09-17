import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (
            email === "zachary.alaba@urios.edu.ph" &&
            password === "Janacute123"
        ) {
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
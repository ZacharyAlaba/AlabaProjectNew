import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-page">
            <div className="home-hero">
                <h1>Welcome to the Father Saturnino Urios University</h1>
                <p>Let your light shine now and forever</p>
                <Link className="hero-btn" to="/aboutus">About us</Link>
            </div>
        </div>
    );
}
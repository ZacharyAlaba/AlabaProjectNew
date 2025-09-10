// resources/js/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="/images/fsuu-logo.png" alt="FSUU Logo" className="navbar-logo" />
                Father Saturnino Urios University
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/aboutus">About Us</Link></li>
                <li><Link to="/contactus">Contact Us</Link></li>
                 <li><Link to="/login">Login</Link></li> 
            </ul>
        </nav>
    );
}
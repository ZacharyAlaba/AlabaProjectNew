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
            {/* Footer */}
            <footer className="home-footer">
                <span>© Zachary Jon C. Alaba 2025 Father Saturnino Urios University. All rights reserved.</span>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms">Terms of Use</Link>
                <Link to="/sitemap">Sitemap</Link>
            </footer>
        </div>
    );
}
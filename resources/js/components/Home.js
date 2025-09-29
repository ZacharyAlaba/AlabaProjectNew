import React from "react";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home() {
    return (
        <div className="home-page">
            <Carousel
                showThumbs={false}
                autoPlay
                infiniteLoop
                showStatus={false}
                interval={5000}
            >
                <div className="carousel-slide">
                    <img src="/images/slide2.jpg" alt="Slide 2" />
                    <div className="carousel-overlay">
                        <h2>Welcome to the Father Saturnino Urios University</h2>
                        <p>Let your light shine now and forever</p>
                        <Link className="carousel-btn" to="/aboutus">About us</Link>
                    </div>
                </div>
                <div className="carousel-slide">
                    <img src="/images/slide1.jpg" alt="Slide 1" />
                    <div className="carousel-overlay">
                        <h2>Follow your passion</h2>
                        <p>Nurture your talent using our courses. Choose your path whether it's nursing, business, law, or something else!</p>
                        <Link className="carousel-btn" to="/contactus">Contact us</Link>
                    </div>
                </div>
                {/* Add more slides as needed */}
            </Carousel>
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
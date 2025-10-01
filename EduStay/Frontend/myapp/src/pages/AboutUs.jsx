import React from 'react';
import './AboutUs.css';

export default function AboutUs() {
    return (
        <div className="about-container">
            <div className="about-hero">
                <h1>About EduStay</h1>
                <p>Your trusted partner in finding the perfect student accommodation</p>
            </div>

            <div className="about-content">
                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        EduStay is dedicated to connecting students with verified, safe, and affordable 
                        accommodation near universities. We understand the challenges students face when 
                        searching for housing, and we're here to make that process simple and secure.
                    </p>
                </section>

                <section className="features-section">
                    <h2>Why Choose EduStay?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🔍 Verified Properties</h3>
                            <p>All listings are thoroughly verified for quality, safety, and authenticity</p>
                        </div>
                        <div className="feature-card">
                            <h3>💰 Budget-Friendly</h3>
                            <p>Properties designed specifically for student budgets with transparent pricing</p>
                        </div>
                        <div className="feature-card">
                            <h3>🔐 Secure Platform</h3>
                            <p>JWT-based authentication with 30-minute session timeout for your security</p>
                        </div>
                        <div className="feature-card">
                            <h3>📱 Easy Booking</h3>
                            <p>Simple and secure online booking process with 24/7 support</p>
                        </div>
                    </div>
                </section>

                <section className="tech-section">
                    <h2>Built with Modern Technology</h2>
                    <div className="tech-stack">
                        <div className="tech-item">
                            <h4>Frontend</h4>
                            <p>React.js, CSS3, Responsive Design</p>
                        </div>
                        <div className="tech-item">
                            <h4>Backend</h4>
                            <p>Spring Boot, MySQL, JWT Authentication</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
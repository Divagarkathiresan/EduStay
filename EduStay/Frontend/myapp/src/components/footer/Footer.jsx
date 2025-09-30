import React from "react";
import "./Footer.css";
export default function Footer(){
    return(
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>EduStay</h3>
                    <p>Find your perfect student accommodation with ease. Trusted by thousands of students across the country.</p>
                    <div className="social-links">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
                
                <div className="footer-section">
                    <h4>For Students</h4>
                    <ul>
                        <li><a href="#">Search Properties</a></li>
                        <li><a href="#">Student Housing</a></li>
                        <li><a href="#">Shared Accommodation</a></li>
                        <li><a href="#">Budget Stays</a></li>
                        <li><a href="#">Premium Properties</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>For Property Owners</h4>
                    <ul>
                        <li><a href="#">List Your Property</a></li>
                        <li><a href="#">Owner Dashboard</a></li>
                        <li><a href="#">Pricing Plans</a></li>
                        <li><a href="#">Property Management</a></li>
                        <li><a href="#">Marketing Tools</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                        <li><a href="#">Sitemap</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; 2024 EduStay. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
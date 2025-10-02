import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import "./HomePage.css";

export default function HomePage(){
    const[location,setLocation]=useState("");
    const navigate = useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            navigate(`/properties/${location}`);
        } catch (error) {
            throw new Error("failed to fetch properties");
        }
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            // Validate token with backend
            const response = fetch('http://localhost:8080/api/auth/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    // Token is invalid, remove it but don't redirect
                    localStorage.removeItem('token');
                }
            })
            .catch(() => {
                // Network error or invalid token, remove it but don't redirect
                localStorage.removeItem('token');
            });
            // Set 30-minute timer for auto-logout
            const timer = setTimeout(() => {
                localStorage.removeItem('token');
                alert('Session expired. Please login again.');
            }, 30 * 60 * 1000);
            return () => clearTimeout(timer);
        }
    }, [navigate]);
    
    return(
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Student Accommodation</h1>
                    <p>Discover comfortable, affordable, and safe housing options near your university</p>
                    <div className="search-bar">
                        <input 
                        type="text"
                        value={location}
                        required
                        onChange={(e)=> setLocation(e.target.value)}
                        placeholder="Enter city or university name" />
                        <button onClick={handleSubmit}>Search Properties</button>
                    </div>
                </div>
            </section>
            <section className="features-section">
                <div className="container">
                    <h2>Why Choose EduStay?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Verified Properties</h3>
                            <p>All properties are verified and inspected for quality and safety</p>
                        </div>
                        <div className="feature-card">
                            <h3>Student-Friendly</h3>
                            <p>Properties designed specifically for student needs and budgets</p>
                        </div>
                        <div className="feature-card">
                            <h3>Easy Booking</h3>
                            <p>Simple and secure online booking process with instant confirmation</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    )
}
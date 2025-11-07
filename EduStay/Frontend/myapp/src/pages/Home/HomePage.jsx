import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { validateSearch } from "../../utils/validation";
import "./HomePage.css";

export default function HomePage(){
    const[location,setLocation]=useState("");
    const[minPrice,setMinPrice]=useState("");
    const[maxPrice,setMaxPrice]=useState("");
    const[propertyType,setPropertyType]=useState("");
    const[errors,setErrors]=useState({});
    const navigate = useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        
        const validationErrors = validateSearch(location, minPrice, maxPrice);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        
        try {
            console.log('Search params:', { location, minPrice, maxPrice, propertyType });
            const params = new URLSearchParams();
            if(location) params.append('location', location);
            if(minPrice) params.append('minPrice', minPrice);
            if(maxPrice) params.append('maxPrice', maxPrice);
            if(propertyType) params.append('propertyType', propertyType);
            const searchUrl = `/properties/${encodeURIComponent(location)}?${params.toString()}`;
            console.log('Navigating to:', searchUrl);
            navigate(searchUrl);
        } catch (error) {
            console.error('Search error:', error);
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
                        placeholder="Enter city, state, district, pincode or area"
                        className={errors.location ? 'error' : ''} />
                        <input 
                        type="number"
                        value={minPrice}
                        onChange={(e)=> setMinPrice(e.target.value)}
                        placeholder="Min Price (₹)"
                        className={errors.minPrice ? 'error' : ''}
                        min="0" />
                        <input 
                        type="number"
                        value={maxPrice}
                        onChange={(e)=> setMaxPrice(e.target.value)}
                        placeholder="Max Price (₹)"
                        className={errors.maxPrice ? 'error' : ''}
                        min="0" />
                        <select 
                        value={propertyType}
                        onChange={(e)=> setPropertyType(e.target.value)}
                        className="property-type-select">
                            <option value="">All Types</option>
                            <option value="PG">PG</option>
                            <option value="Home">Home</option>
                        </select>
                        <button onClick={handleSubmit}>Search Properties</button>
                    </div>
                    {(errors.location || errors.minPrice || errors.maxPrice || errors.priceRange) && (
                        <div className="search-errors">
                            {errors.location && <span className="error-message">{errors.location}</span>}
                            {errors.minPrice && <span className="error-message">{errors.minPrice}</span>}
                            {errors.maxPrice && <span className="error-message">{errors.maxPrice}</span>}
                            {errors.priceRange && <span className="error-message">{errors.priceRange}</span>}
                        </div>
                    )}
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
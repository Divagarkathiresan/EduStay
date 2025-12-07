// pages/Home/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import "./HomePage.css";

export default function HomePage() {
    const [district, setDistrict] = useState(""); // district required for routing
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [propertyType, setPropertyType] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Because you asked to keep min/max required, ensure they exist before navigating
        if (!district || minPrice === "" || maxPrice === "") {
            alert("Please enter district, min price and max price before searching.");
            return;
        }

        const params = new URLSearchParams();
        params.append("district", district);
        params.append("minPrice", minPrice);
        params.append("maxPrice", maxPrice);
        if (propertyType) params.append("type", propertyType);

        // navigate to district search route
        navigate(`/properties/${encodeURIComponent(district)}?${params.toString()}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:8080/api/auth/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    if (!response.ok) localStorage.removeItem("token");
                })
                .catch(() => localStorage.removeItem("token"));
        }
    }, [navigate]);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Student Accommodation</h1>
                    <p>Discover comfortable, affordable, and safe housing options near your university</p>

                    <form className="search-bar" onSubmit={handleSubmit}>
                        {/* DISTRICT SEARCH */}
                        <input
                            type="text"
                            value={district}
                            required
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="Enter district name"
                        />

                        {/* Min Price (required) */}
                        <input
                            type="number"
                            value={minPrice}
                            required
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price (₹)"
                        />

                        {/* Max Price (required) */}
                        <input
                            type="number"
                            value={maxPrice}
                            required
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price (₹)"
                        />

                        {/* Property Type */}
                        <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="property-type-dropdown"
                        >
                            <option value="">All Types</option>
                            <option value="PG">PG</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Home">Home</option>
                        </select>

                        {/* Search Button */}
                        <button type="submit">Search Properties</button>
                    </form>
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
                            <p>Simple and secure online booking with instant confirmation</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

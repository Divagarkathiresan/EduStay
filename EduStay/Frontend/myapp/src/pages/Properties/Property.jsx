import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertiesAsPerLocations } from "../../utils/api";
import "./Property.css";

export default function Property() {
    const { location } = useParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        (async () => {
            try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await getPropertiesAsPerLocations(location);
            setProperties(response);
            } catch (error) {
            console.error("Failed to fetch properties:", error);
            }
        })();
    }, [location, navigate]);
    return (
        <div className="property-container">
            <div className="property-header">
                <h1>Properties in {location}</h1>
                <p>{properties.length} properties found</p>
                <button onClick={() => navigate('/')} className="back-btn">Back to Search</button>
            </div>

            <div className="properties-section">
                <div className="container">
                    {properties.length === 0 ? (
                        <div className="no-properties">
                            <h3>No properties found in {location}</h3>
                            <p>Try searching for a different location</p>
                        </div>
                    ) : (
                        <div className="properties-grid">
                            {properties.map((property, index) => (
                                <div key={index} className="property-card">
                                    <h3>{property.name || `Property ${index + 1}`}</h3>
                                    <p><strong>Title:</strong> {property.title || location}</p>
                                    <p><strong>Location:</strong> {property.location || location}</p>
                                    <p><strong>Type:</strong> {property.type || 'Student Accommodation'}</p>
                                    <p><strong>Price:</strong> ₹{property.rent || '15,000'}/month</p>
                                    <p><strong>Description:</strong> {property.description || 'Comfortable student accommodation with all amenities'}</p>
                                    <div className="property-actions">
                                    <button className="view-btn">View Details</button>
                                    <button className="contact-btn">Contact Owner</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
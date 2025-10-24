import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOwner } from "../../utils/api";
import "./HouseOwner.css";

export default function HouseOwner() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        const loadOwner = async () => {
            try {
                setLoading(true);
                const data = await fetchOwner(id);
                setProperty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadOwner();
        }
    }, [navigate, id]);

    if (loading) return <div className="loading">Loading owner details...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!property) return <div className="no-data">No owner data found</div>;

    return (
        <div className="owner-container">
            <div className="owner-card">
                <h1>Property Owner Details</h1>
                <div className="owner-info">
                    <div className="info-item">
                        <span className="label">Name:</span>
                        <span className="value">{property.owner.name || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Email:</span>
                        <span className="value">{property.owner.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Phone:</span>
                        <span className="value">{property.owner.phone || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Property:</span>
                        <span className="value">{property.title || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Location:</span>
                        <span className="value">{property.location || 'N/A'}</span>
                    </div>
                </div>
                <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}
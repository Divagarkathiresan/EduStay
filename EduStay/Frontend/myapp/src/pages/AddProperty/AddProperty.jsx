import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../utils/api';
import './AddProperty.css';

export default function AddProperty() {
    const [property, setProperty] = useState({
        title: '',
        description: '',
        location: '',
        rent: '',
        amenities: ''
    });
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:8080/api/auth/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserRole(data.role);
            if (data.role !== 'houseOwner') {
                alert('Only house owners can add properties');
                navigate('/');
            }
        })
        .catch(() => {
            navigate('/login');
        });
    }, [navigate]);

    const handleChange = (e) => {
        setProperty({
            ...property,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addProperty({
                ...property,
                rent: parseFloat(property.rent)
            });
            alert('Property added successfully!');
            navigate('/');
        } catch (error) {
            alert(`Failed to add property: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (userRole !== 'houseOwner') {
        return <div>Loading...</div>;
    }

    return (
        <div className="add-property-page">
            <div className="add-property-container">
                <h1>Add New Property</h1>
                <form onSubmit={handleSubmit} className="property-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={property.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={property.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Monthly Rent (₹)</label>
                        <input
                            type="number"
                            name="rent"
                            value={property.rent}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={property.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Amenities</label>
                        <input
                            type="text"
                            name="amenities"
                            value={property.amenities}
                            onChange={handleChange}
                            placeholder="WiFi, AC, Parking, etc."
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Adding...' : 'Add Property'}
                    </button>
                </form>
            </div>
        </div>
    );
}
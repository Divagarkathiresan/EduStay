//pages/AddProperty/AddProperty.jsx
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
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', property.title);
            formData.append('description', property.description);
            formData.append('location', property.location);
            formData.append('rent', parseFloat(property.rent));
            formData.append('amenities', property.amenities);
            images.forEach(image => {
                formData.append('images', image);
            });

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/edustay/properties', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Property added successfully!');
                navigate('/');
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
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
                    
                    <div className="form-group">
                        <label>Property Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="file-input"
                            key={images.length}
                        />
                        <p className="file-help">Select multiple images (hold Ctrl/Cmd to select multiple files)</p>
                        {imagePreviews.length > 0 && (
                            <div className="images-preview">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(index)}
                                            className="remove-image-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Adding...' : 'Add Property'}
                    </button>
                </form>
            </div>
        </div>
    );
}
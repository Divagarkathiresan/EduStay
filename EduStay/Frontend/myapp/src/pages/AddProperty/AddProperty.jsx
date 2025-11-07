import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../utils/api';
import { validateProperty } from '../../utils/validation';
import { showSuccess, showError, showWarning } from '../../utils/toast';
import './AddProperty.css';

export default function AddProperty() {
    const [property, setProperty] = useState({
        title: '',
        description: '',
        location: '',
        rent: '',
        amenities: '',
        propertyType: 'PG'
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [errors, setErrors] = useState({});
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
        const { name, value } = e.target;
        setProperty({
            ...property,
            [name]: value
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = images.length + files.length;
        
        if (totalImages > 10) {
            showWarning(`Maximum 10 images allowed. You can add ${10 - images.length} more images.`);
            return;
        }
        
        const newImages = [...images, ...files];
        setImages(newImages);
        
        const newPreviews = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === files.length) {
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
        
        // Clear the input so same files can be selected again
        e.target.value = '';
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateProperty(property);
        
        // Check if images are provided
        if (images.length === 0) {
            validationErrors.images = 'At least one image is required';
        }
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('title', property.title);
            formData.append('description', property.description);
            formData.append('location', property.location);
            formData.append('rent', parseFloat(property.rent));
            formData.append('amenities', property.amenities);
            formData.append('propertyType', property.propertyType);
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
                showSuccess('Property added successfully!');
                navigate('/');
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            showError(`Failed to add property: ${error.message}`);
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
                            className={errors.title ? 'error' : ''}
                            required
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={property.location}
                            onChange={handleChange}
                            placeholder="Full address: Area, City, District, State, Pincode"
                            className={errors.location ? 'error' : ''}
                            required
                        />
                        {errors.location && <span className="error-message">{errors.location}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Monthly Rent (₹)</label>
                        <input
                            type="number"
                            name="rent"
                            value={property.rent}
                            onChange={handleChange}
                            className={errors.rent ? 'error' : ''}
                            min="1000"
                            max="100000"
                            required
                        />
                        {errors.rent && <span className="error-message">{errors.rent}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={property.description}
                            onChange={handleChange}
                            rows="4"
                            className={errors.description ? 'error' : ''}
                            required
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
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
                        <label>Property Type</label>
                        <select
                            name="propertyType"
                            value={property.propertyType}
                            onChange={handleChange}
                            required
                        >
                            <option value="PG">PG (Paying Guest)</option>
                            <option value="Home">Home/Apartment</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Property Images ({images.length}/10)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="file-input"
                            disabled={images.length >= 10}
                        />
                        {errors.images && <span className="error-message">{errors.images}</span>}
                        {imagePreviews.length > 0 && (
                            <div className="images-preview">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button 
                                            type="button" 
                                            className="remove-image-btn"
                                            onClick={() => removeImage(index)}
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
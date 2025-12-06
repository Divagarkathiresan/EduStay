// pages/AddProperty/AddProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [error, setError] = useState(''); // USER-FRIENDLY ERROR MESSAGE

    const navigate = useNavigate();

    // -------------------------------------------------
    // USER ROLE VALIDATION
    // -------------------------------------------------
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
        .catch(() => navigate('/login'));
    }, [navigate]);

    // -------------------------------------------------
    // FORM INPUT CHANGE
    // -------------------------------------------------
    const handleChange = (e) => {
        setProperty(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // -------------------------------------------------
    // IMAGE VALIDATION + PREVIEW
    // -------------------------------------------------
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // VALIDATION: MAX 5 IMAGES
        if (images.length + files.length > 5) {
            setError("You can upload a maximum of 5 images.");
            return;
        }

        const validFiles = [];

        for (let file of files) {
            // VALIDATION: FILE TYPE
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setError("Only JPG and PNG images are allowed.");
                return;
            }

            // VALIDATION: FILE SIZE MAX 5MB
            if (file.size > 5 * 1024 * 1024) {
                setError("Each image must be less than 5MB.");
                return;
            }

            validFiles.push(file);
        }

        setImages(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
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

    // -------------------------------------------------
    // FRONTEND VALIDATION FUNCTION
    // -------------------------------------------------
    const validateProperty = () => {
        if (property.title.trim().length < 5)
            return "Title must be at least 5 characters long.";

        if (property.description.trim().length < 20)
            return "Description must be at least 20 characters long.";

        if (property.location.trim().length < 3)
            return "Location must be at least 3 characters long.";

        if (!property.rent || isNaN(property.rent))
            return "Rent must be a valid number.";

        const rentValue = parseFloat(property.rent);
        if (rentValue < 1000 || rentValue > 500000)
            return "Rent must be between ₹1000 and ₹500000.";

        if (images.length === 0)
            return "Please upload at least one image.";

        return null; // VALID
    };

    // -------------------------------------------------
    // FORM SUBMIT
    // -------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // RUN VALIDATION
        const validationError = validateProperty();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", property.title);
            formData.append("description", property.description);
            formData.append("location", property.location);
            formData.append("rent", parseFloat(property.rent));
            formData.append("amenities", property.amenities);

            images.forEach(file => formData.append("images", file));

            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8080/edustay/properties", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to add property");
            }

            alert("Property added successfully!");
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------
    // RENDER
    // -------------------------------------------------
    if (userRole !== "houseOwner") return <div>Loading...</div>;

    return (
        <div className="add-property-page">
            <div className="add-property-container">
                <h1>Add New Property</h1>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="property-form">
                    
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={property.title} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={property.location} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Monthly Rent (₹)</label>
                        <input type="number" name="rent" value={property.rent} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="4" value={property.description} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Amenities</label>
                        <input type="text" name="amenities" value={property.amenities} onChange={handleChange} placeholder="WiFi, AC, Parking, etc." />
                    </div>

                    <div className="form-group">
                        <label>Property Images</label>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="file-input" />
                        <p className="file-help">Upload up to 5 images (JPG/PNG only, max 5MB each)</p>

                        {imagePreviews.length > 0 && (
                            <div className="images-preview">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={preview} alt={`Preview ${index}`} />
                                        <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Property"}
                    </button>
                </form>
            </div>
        </div>
    );
}

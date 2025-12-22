import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProperty.css';
import { API_BASE_URL } from "../../config";

export default function AddProperty() {

    const [property, setProperty] = useState({
        title: '',
        description: '',
        propertyType: '',
        areaName: '',
        district: '',
        state: '',
        pincode: '',
        locationDescription: '',
        rent: '',
        amenities: ''
    });

    const [images, setImages] = useState([]);              // REAL array of files
    const [imagePreviews, setImagePreviews] = useState([]); // Base64 previews
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // USER ROLE VALIDATION
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE_URL}/api/auth/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUserRole(data.role);
            if (data.role !== 'houseOwner') {
                alert('Only house owners can add properties');
                navigate('/');
            }
        })
        .catch(() => navigate('/login'));
    }, [navigate]);

    // HANDLE TEXT INPUTS
    const handleChange = (e) => {
        setProperty(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // HANDLE IMAGE SELECTION
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (images.length + selectedFiles.length > 5) {
            setError("You can upload up to 5 images.");
            return;
        }

        const validFiles = [];

        for (let file of selectedFiles) {
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setError("Only JPG and PNG formats are allowed.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Each image must be smaller than 5MB.");
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

    // REMOVE IMAGE
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // FORM VALIDATION
    const validateProperty = () => {
        if (!property.propertyType)
            return "Please select a property type.";

        if (property.title.trim().length < 5)
            return "Title must be at least 5 characters.";

        if (property.description.trim().length < 20)
            return "Description must be at least 20 characters.";

        if (property.areaName.trim().length < 3)
            return "Area name must be at least 3 characters.";

        if (property.district.trim().length < 3)
            return "District must be at least 3 characters.";

        if (property.state.trim().length < 3)
            return "State must be at least 3 characters.";

        if (!property.pincode || property.pincode.length !== 6)
            return "Pincode must be 6 digits.";

        if (property.locationDescription.trim().length < 5)
            return "Location description must be at least 5 characters.";

        if (!property.rent)
            return "Rent is required.";

        const rentValue = parseFloat(property.rent);
        if (rentValue < 1000 || rentValue > 500000)
            return "Rent must be between ₹1000 and ₹500000.";

        if (images.length === 0)
            return "Upload at least one image.";

        return null;
    };

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const validationError = validateProperty();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            Object.entries(property).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append images correctly
            for (let i = 0; i < images.length; i++) {
                formData.append("images", images[i]);
            }

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/edustay/properties`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            alert("Property added successfully!");
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (userRole !== "houseOwner") return <div>Loading...</div>;

    // UI MARKUP
    return (
        <div className="add-property-page">
            <div className="add-property-container">
                <h1>Add New Property</h1>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="property-form">

                    {/* Property Type Dropdown */}
                    <div className="form-group">
                        <label>Property Type</label>
                        <select 
                            name="propertyType"
                            value={property.propertyType}
                            onChange={handleChange}
                            className="dropdown-input"
                        >
                            <option value="">-- Select Type --</option>
                            <option value="PG">PG</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Rental Home">Rental Home</option>
                        </select>
                    </div>

                    {/* Inputs */}
                    <div className="form-group"><label>Title</label><input type="text" name="title" value={property.title} onChange={handleChange} /></div>
                    <div className="form-group"><label>Area Name</label><input type="text" name="areaName" value={property.areaName} onChange={handleChange} /></div>
                    <div className="form-group"><label>District</label><input type="text" name="district" value={property.district} onChange={handleChange} /></div>
                    <div className="form-group"><label>State</label><input type="text" name="state" value={property.state} onChange={handleChange} /></div>
                    <div className="form-group"><label>Pincode</label><input type="number" name="pincode" value={property.pincode} onChange={handleChange} /></div>

                    <div className="form-group">
                        <label>Location Description</label>
                        <textarea name="locationDescription" rows="2" value={property.locationDescription} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Monthly Rent (₹)</label>
                        <input type="number" name="rent" value={property.rent} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="4" value={property.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Amenities</label>
                        <input type="text" name="amenities" value={property.amenities} onChange={handleChange} />
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="form-group">
                        <label>Property Images</label>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} />

                        <div className="images-preview">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="image-preview">
                                    <img src={preview} alt="preview" />
                                    <button type="button" onClick={() => removeImage(index)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Property"}
                    </button>

                </form>
            </div>
        </div>
    );
}

//pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../utils/api";
import "./Profile.css";

export default function Profile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        role:""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        fetchUserData(token);
    }, [navigate]);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser({
                    name: userData.name || "User",
                    email: userData.email || "user@example.com",
                    phone: userData.phone || "",
                    role: userData.role || "Student"
                });
            } else {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
    try {
        const profileData = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        const updated = await updateProfile(profileData);

        // Save updated name for Navbar
        localStorage.setItem("name", updated.name);

        alert("Profile updated successfully!");
        setIsEditing(false);

        // Go to HOME PAGE (not login)
        navigate("/", { replace: true });
        

    } catch (error) {
        alert("Failed to update profile. Please try again.");
    }
};




    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>{user.name}</h1>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>Personal Information</h2>
                        
                        <div className="form-group">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{user.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={user.phone || ""}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{user.phone || "Not provided"}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <p>{user.role}</p>
                        </div>
                        
                        {user.role === 'houseOwner' && (
                            <div className="owner-actions">
                                <button 
                                    type="button" 
                                    onClick={() => window.location.href = '/add-property'}
                                    className="add-property-btn"
                                >
                                    Add New Property
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="profile-actions">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="save-btn">Save Changes</button>
                                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
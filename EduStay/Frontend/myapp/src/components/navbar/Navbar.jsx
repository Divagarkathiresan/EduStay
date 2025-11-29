//components/navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const [username, setUsername] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        
        if (storedName) {
            setUsername(storedName);
        } else {
            const token = localStorage.getItem("token");
            if (token) {
                fetch("http://localhost:8080/api/auth/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    setUsername(data.name);
                    localStorage.setItem("name", data.name);
                })
                .catch(() => {});
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className={`navbar ${isHomePage ? "navbar-home" : "navbar-other"}`}>
            {/* Logo */}
            <Link to="/" className="logo">EduStay</Link>

            <div className="auth-section">
                {isLoggedIn ? (
                    <div 
                        className="profile-wrapper"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="profile-avatar">👤</div>
                        <span className="profile-name">{username}</span>
                        <span className="dropdown-arrow">▼</span>

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="login-btn">Login</Link>
                        <Link to="/register" className="register-btn">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem("token");
            setisLoggedIn(!!token);
            
            if (token) {
                fetchUserName();
            }
        };
        
        checkAuthStatus();
        
        // Listen for storage changes (logout from other tabs)
        window.addEventListener('storage', checkAuthStatus);
        
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserName = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/auth/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUserName(userData.name || "User");
            } else if (response.status === 401 || response.status === 403) {
                // Token is invalid, logout
                handleLogout();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserName("User");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionStart");
        setisLoggedIn(false);
        setUserName("");
        setOpen(false);
        navigate("/login", { replace: true });
    };

    return (
        <div className="navbar">
            <Link to="/" className="logo">EduStay</Link>

            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="user-dropdown" ref={dropdownRef}>
                        <button
                            className="user-button"
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}
                        >
                            Hi, {userName}
                            <span className={`dropdown-arrow ${open ? 'open' : ''}`}>▼</span>
                        </button>

                        {open && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                                    Profile
                                </Link>
                                <button className="dropdown-item logout-item" onClick={handleLogout}>
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

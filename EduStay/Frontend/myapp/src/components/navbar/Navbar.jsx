import React from "react";
import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

export default function Navbar(){
    const[isLoggedIn,setisLoggedIn]=useState(false);
    const[userRole,setUserRole]=useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const token=localStorage.getItem("token");
        setisLoggedIn(!!token);
        
        if (token) {
            fetchUserRole();
        }
    },[]);
    
    const fetchUserRole = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/auth/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setUserRole(data.role);
        } catch (error) {
            console.error('Failed to fetch user role:', error);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setisLoggedIn(false);
        setUserRole('');
        navigate('/login', { replace: true });
    };

    return(
        <div className="navbar">
            <Link to="/" className="logo">EduStay</Link>
            
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                {isLoggedIn && userRole === 'houseOwner' && (
                    <>
                        {/* <li><Link to="/add-property">Add Property</Link></li> */}
                        <li><Link to="/manage-properties">My Properties</Link></li>
                    </>
                )}
            </ul>
            
            <div className="auth-buttons">
            {isLoggedIn ? (
                <>
                    <Link to="/profile" className="profile-btn">Profile</Link>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
            ) : (
                <>
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
                </>
            )}
            </div>
        </div>
    )
}
import React from "react";
import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

export default function Navbar(){
    const[isLoggedIn,setisLoggedIn]=useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const token=localStorage.getItem("token");
        setisLoggedIn(!!token);
    },[]);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setisLoggedIn(false);
        navigate('/login', { replace: true });
    };

    return(
        <div className="navbar">
            <Link to="/" className="logo">EduStay</Link>
            
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
            
            <div className="auth-buttons">
            {isLoggedIn ? (
                <button onClick={handleLogout} className="logout-btn">Logout</button>
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
import React from "react";
import "./LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../utils/api";
import { validateEmail } from "../../utils/validation";
export default function LoginPage(){
    const[name,setname]=useState("");
    const[password,setpassword]=useState("");
    const[alertmsg,setalertmsg]=useState("");
    const[errors,setErrors]=useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        const validationErrors = {};
        
        if (!name.trim()) {
            validationErrors.name = 'Username/Email is required';
        }
        
        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});
        try {
            const token = await LoginUser({name,password});
            console.log("token",token);
            if (!token) {
                setalertmsg("Login succeeded but no token returned");
            } else {
                localStorage.setItem("token",token);
                navigate("/", { replace: true });
            }
        } catch (error) {
            setalertmsg(error.message || "Invalid credentials");
            console.log("error", error.message);
        }

    }
    return(
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h1>This is login page</h1>
                <input 
                type="text" 
                value={name}
                required 
                onChange={(e)=>setname(e.target.value)}
                placeholder="Username or Email"
                className={errors.name ? 'error' : ''}/>
                {errors.name && <span className="error-message">{errors.name}</span>}
                <input 
                type="password"
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
                required/>
                {errors.password && <span className="error-message">{errors.password}</span>}
                <br/>
                <button type="submit">Submit</button>
                <p>Don't have an account?<a href="/register">Register</a></p>
                {alertmsg && <p className="error">{alertmsg}</p>}

            </form>

        </div>
    )
}
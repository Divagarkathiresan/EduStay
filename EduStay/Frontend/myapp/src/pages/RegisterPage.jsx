import React from "react";
import "./RegisterPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../utils/api";
export default function RegisterPage(){
    const[name,setname]=useState("");
    const[email,setemail]=useState("");
    const[password,setpassword]=useState("");
    const[phone,setphone]=useState("");
    const navigate=useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try {
            const response=await RegisterUser({name,email,password,phone});
            console.log(response)
            navigate("/login", { replace: true });
            alert("Registration successful! Please login.");
        } catch (error) {
            console.log("error",error.message);
        }
    }
    return(
        <div className="register-page">
            <form onSubmit={handleSubmit}>
                <h1>This is Register page</h1>
                <input 
                type="text" 
                value={name}
                onChange={(e)=>setname(e.target.value)} 
                required 
                placeholder="name"/>
                <input 
                type="email" 
                value={email}
                onChange={(e)=>setemail(e.target.value)}
                required 
                placeholder="email"/>
                <input 
                type="tel" 
                value={phone}
                onChange={(e)=>setphone(e.target.value)}
                placeholder="phone number"/>
                <input 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
                required/>
                <button type="submit">Submit</button>
                <p>Already have an account?<a href="/login">Login</a></p>
            </form>
        </div>
    )
}
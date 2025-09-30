import React from "react";
import "./LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../utils/api";
export default function LoginPage(){
    const[name,setname]=useState("");
    const[password,setpassword]=useState("");
    const[alertmsg,setalertmsg]=useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!name || !password){
            alert("Please fill all the fields");
            return;
        }
        try {
            const token = await LoginUser({name,password});
            console.log("token",token);
            if (!token) {
                setalertmsg("Login succeeded but no token returned");
            } else {
                localStorage.setItem("token",token);
                navigate("/");
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
                placeholder="name"/>
                <input 
                type="password"
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
                placeholder="password"
                required/>
                <br/>
                <button type="submit">Submit</button>
                {alertmsg && <p className="error">{alertmsg}</p>}
            </form>

        </div>
    )
}
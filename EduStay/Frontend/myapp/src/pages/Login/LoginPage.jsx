// pages/Login/LoginPage.jsx
import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../utils/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertmsg, setAlertmsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all the fields");
            return;
        }

        try {
            const token = await LoginUser({ email, password });
            console.log("token", token);

            if (!token) {
                setAlertmsg("Login succeeded but no token returned");
            } else {
                localStorage.setItem("token", token);
                navigate("/", { replace: true });
            }
        } catch (error) {
            setAlertmsg(error.message || "Invalid credentials");
            console.log("error", error.message);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h1>Welcome back to EduStay</h1>

                <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button type="submit">Login</button>

                <p>
                    Don't have an account? <a href="/register">Register</a>
                </p>

                {alertmsg && <p className="error">{alertmsg}</p>}
            </form>
        </div>
    );
}

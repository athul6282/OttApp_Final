import React, { useEffect } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
    const { signup, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    const handleSignup = () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        signup(name, email, password)
            .then(() => navigate("/"))
            .catch((error) => {
                alert(error.response?.data?.message || "Unable to sign up");
            });
    };

    return (
        <div className="auth-wrapper signup-bg">
            <header className="auth-header">
                <h2 className="logo"></h2>
                <Link className="signin-link" to="/login"></Link>
            </header>

            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="subtitle">
                    Join millions of subscribers and start streaming today.
                </p>

                <input id="name" type="text" placeholder="Full Name" />
                <input id="email" type="email" placeholder="Email Address" />
                <input id="password" type="password" placeholder="Password" />

                <button className="auth-btn" onClick={handleSignup}>Get Started</button>

                <label className="terms">
                     I agree to the Terms of Service and Privacy Policy.
                </label>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;

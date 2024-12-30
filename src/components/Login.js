import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsAuthenticated, loginFunc, oneTimePass}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError("Please enter both email and password.");
                return;
            }
            loginFunc({ email, password });
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setError("Invalid email or password. Please try again.");
        }
    };

    const handleOneTimePass = async () => {
        try{
            if (!email) {
                setError("Please enter email");
                return;
            }
            oneTimePass({ email });
            setError("Password sent to given email!");
        } catch (e){
            console.error(e.message);

        }
    }


    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <div className="login-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="login-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="login-error">{error}</p>} {/* Render error message */}
                <button className="login-button" onClick={handleLogin}>
                    Sign In
                </button>
                <div className="signup-prompt">
                    <p>Don't have an account? <span className="signup-link"
                                                    onClick={() => navigate("/signup")}>Sign Up</span></p>
                </div>
                <div className="signup-prompt">
                    <p>Forgot password? <span className="signup-link"
                                                    onClick={handleOneTimePass}>Send generated password</span></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

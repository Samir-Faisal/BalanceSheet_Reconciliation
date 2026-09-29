import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import "./Login.css";

const Login = () => {
    // ==========================================
    // NAVIGATION
    // ==========================================

    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    // ==========================================
    // LOGIN FUNCTION
    // ==========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        // Remove previous error message
        setError("");

        // ------------------------------------------
        // Frontend validation
        // ------------------------------------------

        if (!username.trim()) {
            setError("Please enter your username.");
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            // ------------------------------------------
            // Send username/password to backend
            // ------------------------------------------

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username: username.trim(),
                    password: password,
                }
            );

            const data = response.data;

            console.log("Login response:", data);

            // ------------------------------------------
            // Check backend response
            // ------------------------------------------

            if (!data.success) {
                setError(
                    data.message || "Login failed."
                );

                return;
            }

            // ------------------------------------------
            // Save authentication information
            // ------------------------------------------

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...data.user,
                    mustChangePassword:
                        data.mustChangePassword,
                })
            );

            if (data.mustChangePassword) {
                navigate("/change-password");
                return;
            }

            // ------------------------------------------
            // NORMAL LOGIN
            // Redirect according to user role
            // ------------------------------------------

            switch (data.user.role) {
                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "PREPARER":
                    navigate("/preparer/dashboard");
                    break;

                case "REVIEWER":
                    navigate("/reviewer/dashboard");
                    break;

                default:
                    setError(
                        "Your account does not have a valid role."
                    );
            }
        } catch (error) {
            console.error(
                "Login error:",
                error.response?.data || error
            );

            // ------------------------------------------
            // Backend error
            // ------------------------------------------

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Login failed."
                );
            } else if (error.request) {
                setError(
                    "Cannot connect to the server. Please make sure the backend is running."
                );
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="login-page">

            <div className="login-container">

                {/* ======================================
            LEFT SIDE
        ====================================== */}

                <div className="login-left">

                    <div className="login-brand">

                        <div className="reconciliation-icon">
                            ↻
                        </div>

                        <h1>
                            Balance
                            <br />
                            Reconciliation
                        </h1>

                        <p>
                            Secure Financial Reconciliation
                            Management System
                        </p>

                    </div>

                </div>

                {/* ======================================
            RIGHT SIDE
        ====================================== */}

                <div className="login-right">

                    <div className="login-form-container">

                        {/* Heading */}

                        <div className="login-heading">
                            <h2>Welcome Back</h2>

                            <p>
                                Please sign in to continue
                            </p>
                        </div>

                        {/* Login Form */}

                        <form
                            onSubmit={handleLogin}
                            className="login-form"
                        >

                            {/* ================================
                  USERNAME
              ================================= */}

                            <div className="form-group">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        <FaUser />
                                    </span>

                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        autoComplete="username"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* ================================
                  PASSWORD
              ================================= */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    <span className="input-icon">
                                        <FaLock />
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    {/* Show / Hide Password */}

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}

                                    </button>

                                </div>

                            </div>

                            {/* ================================
                  ERROR MESSAGE
              ================================= */}

                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}

                            {/* ================================
                  LOGIN BUTTON
              ================================= */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading
                                    ? "Signing in..."
                                    : "Login"}

                            </button>

                        </form>

                        {/* Footer */}

                        <div className="login-footer">

                            <p>
                                Having trouble signing in?
                            </p>

                            <p>
                                Contact your system administrator.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;
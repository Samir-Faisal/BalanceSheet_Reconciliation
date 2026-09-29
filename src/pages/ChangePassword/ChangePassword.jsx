import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
} from "react-icons/fa";

import "./ChangePassword.css";

const ChangePassword = () => {
    const navigate = useNavigate();

    // ==========================================
    // FORM STATES
    // ==========================================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    // ==========================================
    // PASSWORD VISIBILITY STATES
    // ==========================================

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    // ==========================================
    // MESSAGE / LOADING STATES
    // ==========================================

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] =
        useState(false);

    // ==========================================
    // CHANGE PASSWORD FUNCTION
    // ==========================================

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Clear old messages
        setError("");
        setSuccess("");

        // ========================================
        // 1. CHECK EMPTY FIELDS
        // ========================================

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "Please complete all password fields."
            );

            return;
        }

        // ========================================
        // 2. CHECK NEW PASSWORDS MATCH
        // ========================================

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirm password do not match."
            );

            return;
        }

        // ========================================
        // 3. CHECK PASSWORD STRENGTH
        // ========================================

        const passwordRule =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRule.test(newPassword)) {
            setError(
                "Password must contain at least 8 characters, including uppercase, lowercase, number and special character."
            );

            return;
        }

        // ========================================
        // 4. CHECK NEW PASSWORD IS DIFFERENT
        // ========================================

        if (currentPassword === newPassword) {
            setError(
                "Your new password must be different from your current password."
            );

            return;
        }

        // ========================================
        // 5. GET JWT TOKEN
        // ========================================

        const token =
            localStorage.getItem("token");

        if (!token) {
            setError(
                "Your login session was not found. Please login again."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

            return;
        }

        // ========================================
        // 6. SEND REQUEST TO BACKEND
        // ========================================

        try {
            setLoading(true);

            const response = await axios.put(
                "http://localhost:5000/api/auth/change-password",

                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ======================================
            // 7. GET BACKEND RESPONSE
            // ======================================

            const data = response.data;

            console.log(
                "Change password response:",
                data
            );

            if (!data.success) {
                setError(
                    data.message ||
                    "Unable to change password."
                );

                return;
            }

            // ======================================
            // 8. GET USER FROM LOCAL STORAGE
            // ======================================

            const storedUserString =
                localStorage.getItem("user");

            let storedUser = {};

            if (storedUserString) {
                try {
                    storedUser =
                        JSON.parse(storedUserString);
                } catch (error) {
                    console.error(
                        "Unable to read stored user:",
                        error
                    );
                }
            }

            // ======================================
            // 9. UPDATE USER INFORMATION
            //
            // IMPORTANT:
            // The password has now been changed.
            // Therefore mustChangePassword becomes
            // FALSE in the browser as well.
            // ======================================

            const updatedUser = {
                ...storedUser,

                // Use latest information returned
                // by backend
                ...data.user,

                mustChangePassword: false,
            };

            // ======================================
            // 10. SAVE UPDATED USER
            // ======================================

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            // ======================================
            // 11. SHOW SUCCESS MESSAGE
            // ======================================

            setSuccess(
                "Password changed successfully. Redirecting to your dashboard..."
            );

            // ======================================
            // 12. CLEAR PASSWORD FIELDS
            // ======================================

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // ======================================
            // 13. REDIRECT ACCORDING TO ROLE
            //
            // IMPORTANT:
            // This happens AFTER localStorage has
            // been updated.
            // ======================================

            setTimeout(() => {
                const role = data.user.role;

                if (role === "ADMIN") {
                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                if (role === "PREPARER") {
                    navigate(
                        "/preparer/dashboard",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                if (role === "REVIEWER") {
                    navigate(
                        "/reviewer/dashboard",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                // Unknown role
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );
            }, 1200);
        } catch (error) {
            // ======================================
            // ERROR FROM BACKEND
            // ======================================

            console.error(
                "Change password error:",
                error.response?.data || error
            );

            const status =
                error.response?.status;

            const backendMessage =
                error.response?.data?.message;

            // ======================================
            // JWT EXPIRED / INVALID
            // ======================================

            if (
                status === 401 &&
                (
                    backendMessage
                        ?.toLowerCase()
                        .includes("expired") ||
                    backendMessage
                        ?.toLowerCase()
                        .includes("token") ||
                    backendMessage
                        ?.toLowerCase()
                        .includes("authentication")
                )
            ) {
                setError(
                    backendMessage ||
                    "Your session has expired. Please login again."
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setTimeout(() => {
                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );
                }, 1500);

                return;
            }

            // ======================================
            // CURRENT PASSWORD WRONG OR OTHER ERROR
            // ======================================

            setError(
                backendMessage ||
                "Unable to change password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="change-password-page">

            <div className="change-password-card">

                {/* ==================================
            SHIELD ICON
        ================================== */}

                <div className="change-password-icon">
                    <FaShieldAlt />
                </div>

                {/* ==================================
            HEADER
        ================================== */}

                <div className="change-password-header">

                    <h1>
                        Change Your Password
                    </h1>

                    <p>
                        You are using a temporary password.
                        Create a new password before continuing
                        to the Balance Reconciliation System.
                    </p>

                </div>

                {/* ==================================
            FORM
        ================================== */}

                <form
                    className="change-password-form"
                    onSubmit={handleChangePassword}
                >

                    {/* =================================
              CURRENT PASSWORD
          ================================= */}

                    <div className="change-form-group">

                        <label htmlFor="currentPassword">
                            Current Password
                        </label>

                        <div className="change-input-wrapper">

                            <span className="change-input-icon">
                                <FaLock />
                            </span>

                            <input
                                id="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your temporary password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="change-eye-button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                disabled={loading}
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >

                                {showCurrentPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}

                            </button>

                        </div>

                    </div>

                    {/* =================================
              NEW PASSWORD
          ================================= */}

                    <div className="change-form-group">

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <div className="change-input-wrapper">

                            <span className="change-input-icon">
                                <FaLock />
                            </span>

                            <input
                                id="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="change-eye-button"
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                                disabled={loading}
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                            >

                                {showNewPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}

                            </button>

                        </div>

                    </div>

                    {/* =================================
              CONFIRM PASSWORD
          ================================= */}

                    <div className="change-form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <div className="change-input-wrapper">

                            <span className="change-input-icon">
                                <FaLock />
                            </span>

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="change-eye-button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                disabled={loading}
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >

                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}

                            </button>

                        </div>

                    </div>

                    {/* =================================
              PASSWORD REQUIREMENTS
          ================================= */}

                    <div className="password-requirements">

                        <p>
                            Password requirements:
                        </p>

                        <ul>
                            <li>
                                At least 8 characters
                            </li>

                            <li>
                                At least one uppercase letter
                            </li>

                            <li>
                                At least one lowercase letter
                            </li>

                            <li>
                                At least one number
                            </li>

                            <li>
                                At least one special character
                            </li>

                            <li>
                                Must be different from your
                                current password
                            </li>
                        </ul>

                    </div>

                    {/* =================================
              ERROR MESSAGE
          ================================= */}

                    {error && (
                        <div className="change-password-error">
                            {error}
                        </div>
                    )}

                    {/* =================================
              SUCCESS MESSAGE
          ================================= */}

                    {success && (
                        <div className="change-password-success">
                            {success}
                        </div>
                    )}

                    {/* =================================
              SUBMIT BUTTON
          ================================= */}

                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={loading || success}
                    >

                        {loading
                            ? "Changing Password..."
                            : success
                                ? "Password Changed"
                                : "Change Password"}

                    </button>

                </form>

            </div>

        </div>
    );
};

export default ChangePassword;
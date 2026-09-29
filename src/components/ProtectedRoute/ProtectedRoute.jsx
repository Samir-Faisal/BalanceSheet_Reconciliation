import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
    children,
    allowedRoles,
}) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!token || !storedUser) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // ==========================================
    // MUST CHANGE PASSWORD FIRST
    // ==========================================

    if (user.mustChangePassword === true) {
        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    // ==========================================
    // CHECK USER ROLE
    // ==========================================

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // ==========================================
    // ACCESS ALLOWED
    // ==========================================

    return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";

const PasswordChangeRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Not logged in
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

    // User still needs to change password
    // Allow access to this page
    if (user.mustChangePassword === true) {
        return children;
    }

    // Password already changed
    // Do NOT allow this page again

    switch (user.role) {
        case "ADMIN":
            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );

        case "PREPARER":
            return (
                <Navigate
                    to="/preparer/dashboard"
                    replace
                />
            );

        case "REVIEWER":
            return (
                <Navigate
                    to="/reviewer/dashboard"
                    replace
                />
            );

        default:
            return (
                <Navigate
                    to="/login"
                    replace
                />
            );
    }
};

export default PasswordChangeRoute;
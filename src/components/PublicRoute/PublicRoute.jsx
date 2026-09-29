import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Not logged in → allow login page
    if (!token || !storedUser) {
        return children;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return children;
    }

    // Logged in but still needs password change
    if (user.mustChangePassword) {
        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    // Logged in → send to correct dashboard
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
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return children;
    }
};

export default PublicRoute;
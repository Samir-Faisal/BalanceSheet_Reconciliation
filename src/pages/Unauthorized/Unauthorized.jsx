import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        switch (user.role) {
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
                navigate("/login");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f3f6fb",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "50px",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow:
                        "0 10px 35px rgba(0,0,0,0.1)",
                }}
            >
                <h1
                    style={{
                        color: "#073b83",
                    }}
                >
                    Access Denied
                </h1>

                <p>
                    You do not have permission to access
                    this page.
                </p>

                <button
                    onClick={handleBack}
                    style={{
                        marginTop: "20px",
                        padding: "12px 25px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2474e5",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
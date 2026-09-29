import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";

const AdminDashboard = () => {
    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};

    return (
        <DashboardLayout>

            <div>
                <h1>Admin Dashboard</h1>

                <p>
                    Welcome back, {user.name}.
                </p>

                <div
                    style={{
                        marginTop: "30px",
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "20px",
                    }}
                >

                    <div className="dashboard-stat-card">
                        <h3>Total Users</h3>
                        <h2>20</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>Preparers</h3>
                        <h2>12</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>Reviewers</h3>
                        <h2>5</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>Admins</h3>
                        <h2>3</h2>
                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default AdminDashboard;
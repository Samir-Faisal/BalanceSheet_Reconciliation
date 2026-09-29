import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";

const PreparerDashboard = () => {
    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};

    return (
        <DashboardLayout>

            <div>

                <h1>Preparer Dashboard</h1>

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
                        <h3>Assigned</h3>
                        <h2>0</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>In Progress</h3>
                        <h2>0</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>Submitted</h3>
                        <h2>0</h2>
                    </div>

                    <div className="dashboard-stat-card">
                        <h3>Returned</h3>
                        <h2>0</h2>
                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default PreparerDashboard;
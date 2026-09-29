import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHome,
    FaUsers,
    FaFileInvoiceDollar,
    FaClipboardCheck,
    FaHistory,
    FaSignOutAlt,
    FaBars,
    FaUserCircle,
    FaTasks,
    FaUpload,
} from "react-icons/fa";

import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        useState(true);

    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    let user = {};

    try {
        user =
            JSON.parse(
                localStorage.getItem("user")
            ) || {};
    } catch {
        user = {};
    }

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };

    // ==========================================
    // DASHBOARD
    // ==========================================

    const goToDashboard = () => {
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
        <div className="dashboard-layout">

            {/* =====================================
          SIDEBAR
      ===================================== */}

            <aside
                className={
                    sidebarOpen
                        ? "dashboard-sidebar"
                        : "dashboard-sidebar sidebar-closed"
                }
            >

                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="sidebar-logo-icon">
                        ↻
                    </div>

                    {sidebarOpen && (
                        <div>
                            <h2>Balance</h2>
                            <span>Reconciliation</span>
                        </div>
                    )}

                </div>

                {/* =================================
            NAVIGATION
        ================================= */}

                <nav className="sidebar-navigation">

                    {/* DASHBOARD */}

                    <button
                        className="sidebar-item"
                        onClick={goToDashboard}
                    >
                        <FaHome />

                        {sidebarOpen && (
                            <span>Dashboard</span>
                        )}
                    </button>

                    {/* =================================
              ADMIN MENU
          ================================= */}

                    {user.role === "ADMIN" && (
                        <>
                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate("/admin/users")
                                }
                            >
                                <FaUsers />

                                {sidebarOpen && (
                                    <span>Manage Users</span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate("/admin/accounts")
                                }
                            >
                                <FaFileInvoiceDollar />

                                {sidebarOpen && (
                                    <span>Accounts</span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/admin/reconciliations"
                                    )
                                }
                            >
                                <FaClipboardCheck />

                                {sidebarOpen && (
                                    <span>
                                        Reconciliations
                                    </span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate("/admin/audit-logs")
                                }
                            >
                                <FaHistory />

                                {sidebarOpen && (
                                    <span>Audit Logs</span>
                                )}
                            </button>
                        </>
                    )}

                    {/* =================================
              PREPARER MENU
          ================================= */}

                    {user.role === "PREPARER" && (
                        <>
                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/preparer/assignments"
                                    )
                                }
                            >
                                <FaTasks />

                                {sidebarOpen && (
                                    <span>
                                        My Assignments
                                    </span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/preparer/reconciliations"
                                    )
                                }
                            >
                                <FaFileInvoiceDollar />

                                {sidebarOpen && (
                                    <span>
                                        Reconciliations
                                    </span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/preparer/evidence"
                                    )
                                }
                            >
                                <FaUpload />

                                {sidebarOpen && (
                                    <span>Evidence</span>
                                )}
                            </button>
                        </>
                    )}

                    {/* =================================
              REVIEWER MENU
          ================================= */}

                    {user.role === "REVIEWER" && (
                        <>
                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/reviewer/review-queue"
                                    )
                                }
                            >
                                <FaClipboardCheck />

                                {sidebarOpen && (
                                    <span>Review Queue</span>
                                )}
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() =>
                                    navigate(
                                        "/reviewer/history"
                                    )
                                }
                            >
                                <FaHistory />

                                {sidebarOpen && (
                                    <span>
                                        Review History
                                    </span>
                                )}
                            </button>
                        </>
                    )}

                </nav>

                {/* =================================
            LOGOUT
        ================================= */}

                <div className="sidebar-bottom">

                    <button
                        className="sidebar-item logout-item"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />

                        {sidebarOpen && (
                            <span>Logout</span>
                        )}
                    </button>

                </div>

            </aside>

            {/* =====================================
          MAIN AREA
      ===================================== */}

            <div className="dashboard-main">

                {/* =================================
            HEADER
        ================================= */}

                <header className="dashboard-header">

                    <button
                        className="sidebar-toggle"
                        onClick={() =>
                            setSidebarOpen(
                                !sidebarOpen
                            )
                        }
                    >
                        <FaBars />
                    </button>

                    <div className="header-right">

                        <div className="header-user-icon">
                            <FaUserCircle />
                        </div>

                        <div className="header-user-details">

                            <strong>
                                {user.name || "User"}
                            </strong>

                            <span>
                                {user.role || ""}
                            </span>

                        </div>

                    </div>

                </header>

                {/* =================================
            PAGE CONTENT
        ================================= */}

                <main className="dashboard-content">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;
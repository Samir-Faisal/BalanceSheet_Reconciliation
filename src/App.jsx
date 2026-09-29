import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Login from "./pages/Login/Login";

import ChangePassword from "./pages/ChangePassword/ChangePassword";

import Unauthorized from "./pages/Unauthorized/Unauthorized";

import AdminDashboard from "./pages/Admin/AdminDashboard";

import PreparerDashboard from "./pages/Preparer/PreparerDashboard";

import ReviewerDashboard from "./pages/Reviewer/ReviewerDashboard";

// ==========================================
// ROUTE PROTECTION
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import PublicRoute from "./components/PublicRoute/PublicRoute";

import PasswordChangeRoute from "./components/PasswordChangeRoute/PasswordChangeRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================
            HOME
        ================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ==================================
            LOGIN

            Logged-in users cannot access
            this page.
        ================================== */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ==================================
            CHANGE PASSWORD

            Only users with:
            mustChangePassword = true

            can access this page.
        ================================== */}

        <Route
          path="/change-password"
          element={
            <PasswordChangeRoute>
              <ChangePassword />
            </PasswordChangeRoute>
          }
        />

        {/* ==================================
            ADMIN DASHBOARD
        ================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            PREPARER DASHBOARD
        ================================== */}

        <Route
          path="/preparer/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["PREPARER"]}
            >
              <PreparerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            REVIEWER DASHBOARD
        ================================== */}

        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["REVIEWER"]}
            >
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            UNAUTHORIZED
        ================================== */}

        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "PREPARER",
                "REVIEWER",
              ]}
            >
              <Unauthorized />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            UNKNOWN URL
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
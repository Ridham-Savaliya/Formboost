import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedSelector } from "../recoil/auth";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { UserDashboard } from "../pages/UserDashboard";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes for UserDashboard */}
          <Route index element={<UserDashboard />} />
          <Route path="form/:formId" element={<UserDashboard />} />
          <Route path="profile" element={<UserDashboard />} />
          <Route path="settings" element={<UserDashboard />} />
          <Route path="subscriptions" element={<UserDashboard />} />
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

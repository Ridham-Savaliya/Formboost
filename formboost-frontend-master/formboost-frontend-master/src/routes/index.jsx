import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { isAuthenticatedSelector } from "../recoil/auth";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { UserDashboard } from "../pages/UserDashboard";
import LandingPage from "../pages/LandingPage";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

import { useEffect, useState } from "react";

const TopProgress = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!visible) return null;
  return <div className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-40 animate-[progress_0.9s_ease-out]" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <TopProgress />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />

        {/* Protected dashboard routes under /dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

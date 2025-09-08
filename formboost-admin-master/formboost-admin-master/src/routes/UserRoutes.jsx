import { Routes, Route, Navigate } from "react-router-dom";
import { UserDashboard } from "../pages/user/UserDashboard";

const UserRoutes = () => {
  // add authentication check here
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route index element={<UserDashboard />} />
    </Routes>
  );
};

export default UserRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { isAuthenticated } from "../services/Authservices"; // Import the AuthService
// import { RecoilRoot } from "recoil";

const AdminRoutes = () => {
  // const isAdmin = isAuthenticated(); // Check if the user is authenticated

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    // <RecoilRoot>
      <Routes>
        <Route index element={<AdminDashboard />} />
      </Routes>
    // </RecoilRoot>
  );
};

export default AdminRoutes;

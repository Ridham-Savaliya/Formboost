import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import AdminDashboard from "../pages/AdminDashboard";
import { RecoilRoot } from "recoil";
import { useIsAuthenticated } from "../services/Authservices";
import GlobalSettings from "../components/GlobalSettings";


// This wrapper ensures the hook is used within a valid React component
const Authenticated = ({ element }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/users"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/forms"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/manage-admin"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/transactions"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/subscriptions"
          element={<Authenticated element={<AdminDashboard />} />}
        />

        <Route
          path="/profile"
          element={<Authenticated element={<AdminDashboard />} />}
        />
        <Route
          path="/account-settings"
          element={<Authenticated element={<AdminDashboard />} />}
        />

        <Route
          path="/GlobalSettings"
          element={<Authenticated element={<AdminDashboard />} />}
        />

        <Route
          path="/plans"
          element={<Authenticated element={<AdminDashboard />} />}
        />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
);

export default AppRoutes;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLogin } from "../../src/services/Authservices";
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/"); // Or your dashboard route
      }, 2000);
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Login failed!"}`,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-2xl font-bold text-center mb-10 text-blue-900  ">
          Login To Your Account
        </h2>
        {/* <p className="text-center m-4 text-gray-600 font-serif">Enter your email & password to login</p> */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2">Your Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle show/hide state
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              >
                {showPassword ? (
                  <IoEye className="w-10 h-6"/>
                ) : (
                 <FaEyeSlash className="w-10"/>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <span className="text-blue-500">
              <Link to={"/signup"}>Create one</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

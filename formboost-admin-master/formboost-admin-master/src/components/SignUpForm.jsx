// src/components/SignUpForm.js
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {BACKEND_URL} from "../../src/utils/constants"
import { useLogin } from "../../src/services/Authservices";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useLogin();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const data = { name, email, password };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        data
      );

      if (response.data.success) {
        const token = response.data.data.token;
        await login(email, password); // Log in the user after signup

        toast.success("Account created successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Something went wrong!"}`,
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
    }
  };

  useEffect(() => {
    toast.success("Welcome to signupPage!", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-900">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-4 text-md">
          Enter your personal details to create an account
        </p>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <span className="text-blue-500">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;

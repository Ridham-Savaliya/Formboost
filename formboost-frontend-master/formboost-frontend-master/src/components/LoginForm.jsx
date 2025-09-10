import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
} from "../firebase/auth";

import { authenticateWithBackend } from "../recoil/auth";

import { authState } from "../recoil/auth";
import { useSetRecoilState } from "recoil";

const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear main form error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithEmail(
        formData.email,
        formData.password
      );
      const backendResponse = await authenticateWithBackend(firebaseUser, setAuth);

      if (backendResponse) {
        if (backendResponse.userRegistered === false) {
          // Redirect to signup with pre-filled data
          navigate("/signup", {
            state: {
              fromGoogle: false,
              email: firebaseUser.email,
              name: firebaseUser.displayName || "",
            },
          });
          return;
        }
        // User is registered, proceed to dashboard
        navigate("/");
      } else {
        setError(
          "Failed to authenticate with the backend. Please try again or contact support."
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      const backendResponse = await authenticateWithBackend(
        firebaseUser,
        setAuth
      );

      if (backendResponse) {
        if (backendResponse.userRegistered === false) {
          // Redirect to signup with pre-filled data
          navigate("/signup", { 
            state: { 
              fromGoogle: true,
              email: firebaseUser.email,
              name: firebaseUser.displayName || ""
            } 
          });
          return;
        }
        // User is registered, proceed to dashboard
        navigate("/");
      } else {
        setError("Failed to authenticate with the backend. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to login with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setModalError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(resetEmail);
      handleModalClose();
      setSuccessMessage(
        `Password reset email sent to ${resetEmail}. Please check your inbox.`
      );
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.code === 'auth/user-not-found') {
        setModalError("No account found with this email address");
      } else if (error.code === 'auth/invalid-email') {
        setModalError("Please enter a valid email address");
      } else {
        setModalError(error.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setModalError(null);
    setResetEmail("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalError(null);
    setResetEmail("");
  };

  return (
    // Update the background div
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background overlay with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 animate-gradient-slow" />
      {/* Background overlay - always visible */}

      <div className="fixed inset-0 bg-black/30" />

      {/* Main login form - hidden when modal is open */}
      <div
        className={`relative z-10 w-full flex items-center justify-center transition-all duration-300 ${
          isModalOpen
            ? "opacity-0 pointer-events-none scale-95"
            : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4 text-[#0080FF]">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
              />
            </div>

            <div className="relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoMdEye size={20} />
                ) : (
                  <IoMdEyeOff size={20} />
                )}
              </button>
            </div>

            {/* Error message with slide-down animation */}
            <Transition
              show={!!error}
              enter="transition-all duration-300 ease-out"
              enterFrom="transform -translate-y-2 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-2 opacity-0"
            >
              <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-100 rounded-md p-3">
                {error}
              </div>
            </Transition>

            {/* Success message with slide-down animation */}
            <Transition
              show={!!successMessage}
              enter="transition-all duration-300 ease-out"
              enterFrom="transform -translate-y-2 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-2 opacity-0"
            >
              <div className="text-green-500 text-sm font-medium bg-green-50 border border-green-100 rounded-md p-3">
                {successMessage}
              </div>
            </Transition>

            <button
              type="submit"
              className="w-full bg-[#0080FF] text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleModalOpen}
                className="text-blue-500 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full" />
            <span className="px-2 text-gray-500">or</span>
            <hr className="w-full" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <FcGoogle className="mr-2" size={20} />
            Login with Google
          </button>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={handleModalClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Reset Password
                  </Dialog.Title>
                  <form onSubmit={handleForgotPassword} className="mt-4">
                    <p className="text-sm text-gray-500">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </p>

                    <div className="mt-4">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setModalError(null);
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Modal error message with animation */}
                    <Transition
                      show={!!modalError}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="transform -translate-y-2 opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition-all duration-200 ease-in"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform -translate-y-2 opacity-0"
                    >
                      <div className="mt-2 text-red-500 text-sm font-medium bg-red-50 border border-red-100 rounded-md p-3">
                        {modalError}
                      </div>
                    </Transition>

                    <div className="mt-4 flex justify-between">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-[#0080FF] hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0080FF]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LoginForm;

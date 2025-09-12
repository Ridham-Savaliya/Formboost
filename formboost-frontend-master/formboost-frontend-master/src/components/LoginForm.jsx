import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from "lucide-react";
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
    setError(null);
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
          navigate("/signup", {
            state: {
              fromGoogle: false,
              email: firebaseUser.email,
              name: firebaseUser.displayName || "",
            },
          });
          return;
        }
        navigate("/dashboard");
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
          navigate("/signup", { 
            state: { 
              fromGoogle: true,
              email: firebaseUser.email,
              name: firebaseUser.displayName || ""
            } 
          });
          return;
        }
        navigate("/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-primary-50 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Background soft tint */}
      <div className="absolute inset-0 bg-primary/5"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Messages */}
            <Transition
              show={!!error}
              enter="transition-all duration-300 ease-out"
              enterFrom="transform -translate-y-2 opacity-0 scale-95"
              enterTo="transform translate-y-0 opacity-100 scale-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="transform translate-y-0 opacity-100 scale-100"
              leaveTo="transform -translate-y-2 opacity-0 scale-95"
            >
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            </Transition>

            {/* Success Messages */}
            <Transition
              show={!!successMessage}
              enter="transition-all duration-300 ease-out"
              enterFrom="transform -translate-y-2 opacity-0 scale-95"
              enterTo="transform translate-y-0 opacity-100 scale-100"
              leave="transition-all duration-200 ease-in"
              leaveFrom="transform translate-y-0 opacity-100 scale-100"
              leaveTo="transform -translate-y-2 opacity-0 scale-95"
            >
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {successMessage}
                    </h3>
                  </div>
                </div>
              </div>
            </Transition>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleModalOpen}
                className="text-sm font-medium text-[#0080FF] hover:text-blue-700 transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#0080FF] to-blue-600 hover:from-[#0070E0] hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md hover:border-gray-300"
            >
              <FcGoogle className="h-5 w-5 mr-3" />
              Continue with Google
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#0080FF] hover:text-blue-700 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleModalClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 text-left align-middle shadow-2xl transition-all border border-white/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Reset your password
                  </Dialog.Title>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setModalError(null);
                        }}
                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all duration-200 bg-gray-50/50"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* Modal Error */}
                    <Transition
                      show={!!modalError}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="transform -translate-y-2 opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition-all duration-200 ease-in"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform -translate-y-2 opacity-0"
                    >
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                        <p className="text-sm text-red-800">{modalError}</p>
                      </div>
                    </Transition>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] transition-colors"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-[#0080FF] to-blue-600 px-4 py-3 text-sm font-semibold text-white hover:from-[#0070E0] hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send reset link"
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
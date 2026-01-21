import { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
} from "../firebase/auth";

import { authenticateWithBackend } from "../recoil/auth";

import { authState } from "../recoil/auth";
import { useSetRecoilState } from "recoil";
import authIllustration from "../assets/auth-illustration.png";

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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#0080FF]/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/10 to-[#0080FF]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Logo & Branding */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#0080FF]/30 group-hover:shadow-xl group-hover:shadow-[#0080FF]/40 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Formboom
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to continue building amazing forms
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-4 border-2 border-gray-200 rounded-2xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#0080FF]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            <FcGoogle className="h-6 w-6 mr-3" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleModalOpen}
                  className="text-sm font-semibold text-[#0080FF] hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group/eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
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
                    <p className="text-sm font-medium text-red-800">{error}</p>
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
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            </Transition>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#0080FF] to-blue-600 hover:from-[#0070E0] hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-[#0080FF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-[#0080FF]/30 hover:shadow-xl hover:shadow-[#0080FF]/40 transform hover:-translate-y-0.5"
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
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-base text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#0080FF] hover:text-blue-700 transition-colors"
              >
                Create free account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our{" "}
              <a href="#" className="text-gray-700 hover:text-[#0080FF] transition-colors">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-gray-700 hover:text-[#0080FF] transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 relative overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#0080FF]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto px-12 text-center">
          {/* Illustration */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0080FF]/30 to-purple-500/30 rounded-3xl blur-2xl transform scale-95" />
            <img
              src={authIllustration}
              alt="Authentication illustration"
              className="relative z-10 w-full max-w-md mx-auto rounded-2xl"
            />
          </div>

          {/* Text Content */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Build Forms That Convert
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Create beautiful, responsive forms in minutes. Collect submissions, integrate with your favorite tools, and grow your business.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <Shield className="w-4 h-4 mr-2 text-[#0080FF]" />
              Spam Protection
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Instant Notifications
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              Pre-built Templates
            </div>
          </div>
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900 mb-2"
                  >
                    Reset your password
                  </Dialog.Title>

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <p className="text-gray-600">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setModalError(null);
                        }}
                        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200"
                        placeholder="name@company.com"
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

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        className="flex-1 inline-flex justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-[#0080FF] to-blue-600 px-6 py-3.5 text-base font-semibold text-white hover:from-[#0070E0] hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-[#0080FF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0080FF]/30"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
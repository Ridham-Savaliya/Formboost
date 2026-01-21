import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState, createUser } from "../recoil/auth";
import { signUpWithEmailAndPassword, signInWithGoogle } from "../firebase/auth";
import { auth } from "../firebase/firebase";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { authenticateWithBackend } from "../recoil/auth";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Sparkles, Shield, Zap, FileText } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import authIllustration from "../assets/auth-illustration.png";

const SignUpForm = () => {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);

  // Handle pre-filled data from previous step
  useEffect(() => {
    if (location.state?.email || location.state?.name) {
      setFormData(prev => ({
        ...prev,
        name: location.state.name || prev.name,
        email: location.state.email || prev.email,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.agreeTerms) {
      setError("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      let firebaseUser = null;
      const arrivedFromGoogle = Boolean(location.state?.fromGoogle);
      const currentUser = auth?.currentUser || null;
      const providers = (currentUser?.providerData || []).map((p) => p.providerId);

      if (arrivedFromGoogle || (currentUser && providers.includes("google.com"))) {
        if (!currentUser) {
          setError("Please sign in with Google again, then set your password.");
          return;
        }

        const credential = EmailAuthProvider.credential(
          formData.email,
          formData.password
        );
        try {
          await linkWithCredential(currentUser, credential);
        } catch (err) {
          if (err.code === "auth/credential-already-in-use" || err.code === "auth/email-already-in-use") {
            setError("This email already has a password. Please log in instead.");
            return;
          }
          if (err.code === "auth/requires-recent-login") {
            setError("Please re-login and try again to link your password.");
            return;
          }
          throw err;
        }

        firebaseUser = currentUser;
      } else {
        firebaseUser = await signUpWithEmailAndPassword(
          formData.email,
          formData.password
        );
      }

      const verify = await authenticateWithBackend(firebaseUser, setAuth);
      if (verify) {
        if (!verify.userRegistered) {
          const userCreationResponse = await createUser({
            name: formData.name,
            email: formData.email,
          });

          if (userCreationResponse.token) {
            const bearer = `Bearer ${userCreationResponse.token}`;
            localStorage.setItem("token", bearer);
            setAuth({ token: bearer, user: firebaseUser });
          }
        }
        navigate("/dashboard");
      } else {
        setError("Failed to authenticate with the backend.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      const success = await authenticateWithBackend(firebaseUser, setAuth);

      if (success) {
        if (success.userRegistered) {
          navigate("/dashboard");
        } else {
          const userCreationResponse = await createUser({
            name: firebaseUser.displayName || "Google User",
            email: firebaseUser.email,
          });

          if (userCreationResponse.token) {
            localStorage.setItem(
              "token",
              `Bearer ${userCreationResponse.token}`
            );
            setAuth({ token: `Bearer ${userCreationResponse.token}`, user: firebaseUser });
          }

          navigate("/dashboard");
        }
      } else {
        setError("Failed to authenticate with the backend.");
      }
    } catch (error) {
      console.error("Google sign up error:", error.message);
      setError("Failed to sign up with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 1, text: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    if (password.length < 10) return { strength: 2, text: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" };
    if (password.length >= 10 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 3, text: "Strong", color: "bg-green-500", textColor: "text-green-500" };
    }
    return { strength: 2, text: "Good", color: "bg-blue-500", textColor: "text-blue-500" };
  };

  const passwordInfo = passwordStrength(formData.password);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#0080FF]/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-[#0080FF]/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 max-w-md mx-auto w-full">
          {/* Logo & Branding */}
          <div className="mb-8">
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
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 text-lg">
              Start building amazing forms for free
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-4 border-2 border-gray-200 rounded-2xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#0080FF]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            <FcGoogle className="h-6 w-6 mr-3" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-14 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="Create a strong password"
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${passwordInfo.textColor}`}>
                      {passwordInfo.text}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formData.password.length} characters
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${passwordInfo.color}`}
                      style={{ width: `${(passwordInfo.strength / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0080FF] transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-14 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0080FF] focus:ring-4 focus:ring-[#0080FF]/10 transition-all duration-200 text-base"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group/eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 group-hover/eye:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`flex items-center text-xs font-medium mt-1.5 ${formData.password === formData.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-600'
                  }`}>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#0080FF] border-2 border-gray-300 rounded-md focus:ring-[#0080FF] focus:ring-offset-0 focus:ring-2 transition-colors cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-gray-700 cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-[#0080FF] hover:text-blue-700 transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#0080FF] hover:text-blue-700 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Error Messages */}
            {error && (
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
            )}

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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0080FF] hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 relative overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-[#0080FF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto px-12 text-center">
          {/* Illustration */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-[#0080FF]/30 rounded-3xl blur-2xl transform scale-95" />
            <img
              src={authIllustration}
              alt="Sign up illustration"
              className="relative z-10 w-full max-w-md mx-auto rounded-2xl"
            />
          </div>

          {/* Text Content */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Journey
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join thousands of businesses using Formboom to collect leads, feedback, and grow their audience.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-xs text-gray-400">Forms Created</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white mb-1">1M+</div>
              <div className="text-xs text-gray-400">Submissions</div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <FileText className="w-4 h-4 mr-2 text-green-400" />
              Free Forever Plan
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <Shield className="w-4 h-4 mr-2 text-[#0080FF]" />
              GDPR Compliant
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              No Credit Card
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
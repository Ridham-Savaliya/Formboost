import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState, createUser } from "../recoil/auth";
import { signUpWithEmailAndPassword, signInWithGoogle } from "../firebase/auth";
import { auth } from "../firebase/firebase";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { authenticateWithBackend } from "../recoil/auth";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";

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
  
  // Handle pre-filled data from previous step (Google or Email login)
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      let firebaseUser = null;

      // If the user arrived from Google (already signed in) or auth has a currentUser,
      // link the email/password credential to that existing account instead of creating a new one.
      const arrivedFromGoogle = Boolean(location.state?.fromGoogle);
      const currentUser = auth?.currentUser || null;
      const providers = (currentUser?.providerData || []).map((p) => p.providerId);

      if (arrivedFromGoogle || (currentUser && providers.includes("google.com"))) {
        if (!currentUser) {
          setError("Please sign in with Google again, then set your password.");
          return;
        }

        // Link email/password to existing Google account
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

        firebaseUser = currentUser; // remain signed in
      } else {
        // Regular email+password signup flow (no Google session)
        firebaseUser = await signUpWithEmailAndPassword(
          formData.email,
          formData.password
        );
      }

      const verify = await authenticateWithBackend(firebaseUser, setAuth);
      if (verify) {
        if (!verify.userRegistered) {
          // Create the backend user profile
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
        navigate("/");
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
    try {
      const firebaseUser = await signInWithGoogle();
      const success = await authenticateWithBackend(firebaseUser, setAuth);
      console.log(success);

      if (success) {
        if (success.userRegistered) {
          navigate("/");
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

          console.log("Backend user creation response:", userCreationResponse);
          navigate("/");
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

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((prevState) => !prevState);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword((prevState) => !prevState);
    }
  };

  return (
    // Update the background div
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background overlay with animated gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 animate-gradient-slow" />
      <div className="absolute bg-black opacity-30 w-full h-full"></div>
      <div className="absolute z-10 w-full h-full flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 text-[#0080FF]">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                placeholder=""
              />
            </div>
            <div className="mb-4">
              <label className="block  mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                placeholder=""
              />
            </div>
            <div className="mb-4 relative">
              <label className="block  mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                placeholder=""
              />
              <div
                className="absolute top-2/3 transform -translate-y-1/3 right-4 cursor-pointer"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block  mb-2">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0080FF]"
                placeholder=""
              />
              <div
                className="absolute top-2/3 transform -translate-y-1/3 right-4 cursor-pointer"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-700 text-sm">
                  I agree and accept the{" "}
                  <a href="#" className="text-blue-500">
                    terms and conditions
                  </a>
                </span>
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-semibold mb-4">
                *{error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0080FF] text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="mt-4 flex items-center justify-between">
              <hr className="w-full" />
              <span className="px-2 text-gray-500">or</span>
              <hr className="w-full" />
            </div>

            <button
              onClick={handleGoogleSignUp}
              className="w-full mt-4 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              <FcGoogle className="mr-2" size={20} />
              Sign Up with Google
            </button>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?
              <Link to="/login" className="text-blue-500 ml-1">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

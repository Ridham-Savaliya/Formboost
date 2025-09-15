import { useState, useEffect } from "react";
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import { auth } from "../firebase/firebase";
import { EmailAuthProvider, linkWithCredential, updatePassword } from "../firebase/firebase-mock.js";

export const ProfileInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // decode jwt token to get user id and store it in userId variable
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUserId = decodeTokenUserId(token);
      setUserId(decodedUserId);
    }

    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
          {
            headers: { Authorization: token },
          }
        );
        const { name, email } = response.data.data;
        setFormData((prevState) => ({ ...prevState, name, email }));
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) {
        throw new Error("Authentication failed");
      }
      // 1) If user entered a new password, set it on Firebase Auth (client-side)
      if (formData.newPassword) {
        if (!auth || !auth.currentUser) {
          throw new Error("Can't set password: not signed in.");
        }

        const currentUser = auth.currentUser;
        const providers = (currentUser.providerData || []).map(p => p.providerId);

        // If the account doesn't have password auth linked yet, link it using the provided email + newPassword
        if (!providers.includes("password")) {
          try {
            const credential = EmailAuthProvider.credential(formData.email, formData.newPassword);
            await linkWithCredential(currentUser, credential);
          } catch (err) {
            // If already linked or other known issues, surface a helpful message
            if (err.code === "auth/credential-already-in-use") {
              throw new Error("This email already has a password. Try logging in with email and password.");
            } else if (err.code === "auth/requires-recent-login") {
              throw new Error("Please re-login and try again to set your password.");
            } else if (err.code === "auth/email-already-in-use") {
              throw new Error("Email already in use by another account.");
            }
            throw err;
          }
        } else {
          // If password provider already linked, update password
          try {
            await updatePassword(currentUser, formData.newPassword);
          } catch (err) {
            if (err.code === "auth/requires-recent-login") {
              throw new Error("Please re-login and try again to change your password.");
            }
            throw err;
          }
        }
      }

      // 2) Update name/email in our backend profile
      const userData = {
        name: formData.name,
        email: formData.email,
      };

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${userId}`,
        userData,
        {
          headers: { Authorization: token },
        }
      );

      setSuccess(true);
      setFormData((prevState) => ({
        ...prevState,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-semibold">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full p-2 border rounded-lg"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-2 border rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="newPassword" className="block mb-2 font-semibold">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          className="w-full p-2 border rounded-lg"
          value={formData.newPassword}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="w-full p-2 border rounded-lg"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">Profile updated successfully!</div>
      )}
      <button
        type="submit"
        className="bg-[#0080FF] text-white px-4 py-2 rounded-lg"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

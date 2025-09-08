import { useState, useEffect } from "react";
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";

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
          `${import.meta.env.VITE_BACKEND_URL}/user`,
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
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      if (formData.newPassword) {
        userData.password = formData.newPassword;
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
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
      setError("Failed to update profile");
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

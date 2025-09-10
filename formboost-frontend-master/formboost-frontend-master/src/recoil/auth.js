import { atom, selector } from "recoil";
import axios from "axios";

// Atom to store authentication state
export const authState = atom({
  key: "authState",
  default: {
    token: localStorage.getItem("token"),
    user: null,
  },
});

// Selector to check if the user is authenticated
export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const auth = get(authState);
    return !!auth.token;
  },
});

// Create axios instance with baseURL
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor to add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to authenticate with the backend using Firebase ID token
export const authenticateWithBackend = async (firebaseUser, setAuth) => {
  try {
    const idToken = await firebaseUser.getIdToken();

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const { success, data } = response.data;
    if (success) {
      const token = `Bearer ${data.token}`;
      localStorage.setItem("token", token);
      setAuth({ token, user: firebaseUser });

      // Return the full response to check user registration status
      return data;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error("Authentication error:", error.response?.data?.message || error.message);
    return null;
  }
};

// Function to create a user in the backend
// Uses backend JWT attached by axios interceptor
export const createUser = async ({ name, email }) => {
  try {
    const response = await api.post("/api/v1/user/create", { name, email });

    const { success, data } = response.data;
    if (success) {
      console.log("User created successfully:", data);
      return data;
    } else {
      throw new Error("User creation failed");
    }
  } catch (error) {
    const backendMessage = error.response?.data?.message;
    const status = error.response?.status;
    console.error("Error creating user:", backendMessage || error.message);
    if (status === 409) {
      // Email already exists
      throw new Error("This email is already registered. Please log in instead.");
    }
    throw new Error(backendMessage || error.message || "Failed to create account. Please try again.");
  }
};

// Function to log out the user
export const logout = (setAuth) => {
  localStorage.removeItem("token");
  setAuth({ token: null, user: null });
};

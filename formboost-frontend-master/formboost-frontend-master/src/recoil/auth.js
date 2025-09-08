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
      `${import.meta.env.VITE_BACKEND_URL}/user/verify`,
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
    console.error("Authentication error:", error.message);
    return null;
  }
};

// Function to create a user in the backend
export const createUser = async ({ name, email }) => {
  try {
    const response = await api.post("/user/create", {
      name,
      email,
    });

    // Destructure status and data from the response
    const { success, data } = response.data;

    // Check if the creation was successful
    if (success) {
      // Log the successful creation
      console.log("User created successfully:", data);
      // Return the data object which includes the token
      return data; // Return the data object to be used in the caller
    } else {
      throw new Error("User creation failed");
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// Function to log out the user
export const logout = (setAuth) => {
  localStorage.removeItem("token");
  setAuth({ token: null, user: null });
};

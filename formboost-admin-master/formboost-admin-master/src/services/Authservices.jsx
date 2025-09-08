import { atom, selector } from "recoil";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { BACKEND_URL } from "../../src/utils/constants";


export const tokenState = atom({
  key: "tokenState", // unique ID (with respect to other atoms/selectors)
  default: localStorage.getItem("authToken") || "", // default value (aka initial value)
});

export const authState = selector({
  key: "authState",
  get: ({ get }) => {
    const token = get(tokenState);
    return !!token; // returns true if token exists, false otherwise
  },
});

// Create an Axios instance
export const api = axios.create({
  baseURL:`${BACKEND_URL}`, // Replace with your backend URL
});

// Add a request interceptor to include the token in all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     console.log(token)
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export const useLogin = () => {
  const setToken = useSetRecoilState(tokenState);

  return async (email, password) => {
    try {
      const response = await api.post("/admin/login", { email, password });
      const token = response.data.data.token;
      setToken(token);
      localStorage.setItem("authToken", token);
      return token;
    } catch (error) {
      throw error;
    }
  };
};

export const useLogout = () => {
  const setToken = useSetRecoilState(tokenState);

  return () => {
    localStorage.removeItem("authToken");
    setToken("");
    window.location.href = "/login"; // Redirect to login after logout
  };
};

export const useIsAuthenticated = () => {
  return useRecoilValue(authState);
};

// Protect a route based on authentication status
export const requireAuth = (element) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

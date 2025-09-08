import { jwtDecode } from "jwt-decode";

export const decodeTokenUserId = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.id; // Adjust this based on your token structure
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

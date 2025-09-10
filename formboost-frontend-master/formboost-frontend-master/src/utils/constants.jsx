import { jwtDecode } from "jwt-decode";

export const decodeTokenUserId = (token) => {
  try {
    // Remove 'Bearer ' prefix if it exists
    const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwtDecode(tokenValue);
    return decoded.id; // Adjust this based on your token structure
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

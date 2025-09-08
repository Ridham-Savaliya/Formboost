import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoPricetagSharp } from "react-icons/io5";
import { useLogout } from "../../src/services/Authservices";
import axios from "axios"; // Import axios
import { BACKEND_URL } from "../utils/constants";

export const Profile = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adminData, setAdminData] = useState({name: ""}); // State to store admin data
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const logout = useLogout(); // Call the hook to get the logout function

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    // Fetch admin data from API
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add the token if required
            },
          }
        );
        const name = response.data.data.name; // Extract the name from the response
        console.log(name); // Log the name to the console
        setAdminData({ name }); // Set the adminData state with the name
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };
  
    fetchAdminData();
  }, []);
  

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="relative">
      <img
        id="avatarButton"
        type="button"
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full cursor-pointer object-cover"
        src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
        alt="User dropdown"
      />
      {dropdownVisible && (
        <div
          id="userDropdown"
          ref={dropdownRef}
          className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{adminData.name}</div> 
            {/* <div className="font-medium truncate">{adminData.email}</div>{" "} */}
            {/* Display admin email */}
          </div>
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="avatarButton"
          >
            <li className="flex hover:bg-gray-100">
              <Link
                to="/profile/"
                className="gap-4 items-center px-4 py-2 flex"
              >
                <FaUser className="hover:text-blue-700" />
                Profile
              </Link>
            </li>

            <li>
              <Link
                to="/plans/"
                className="items-center px-4 py-2 hover:bg-gray-100 flex gap-4"
              >
                <IoPricetagSharp className="hover:text-blue-700" />
                Manage Plans
              </Link>
            </li>
          </ul>
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex gap-4"
            >
              <FaSignOutAlt className="hover:text-blue-700" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

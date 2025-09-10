import { useState, useEffect, useRef, useCallback } from "react";
import { FaUser } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdSubscriptions } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { logout } from "../recoil/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`,
        {
          headers: { Authorization: token },
        }
      );

      const { success, data } = response.data;
      if (success) {
        setUser({ name: data.name, email: data.email });
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      navigate("/login");

      console.error("User fetch error:", error);
      setError("Failed to fetch user data");
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      <FaCircleUser
        onClick={toggleDropdown}
        className="w-8 h-8 rounded-full cursor-pointer object-cover text-[#0080FF]"
      />

      {dropdownVisible && user && (
        <div
          id="userDropdown"
          ref={dropdownRef}
          className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-52"
        >
          <div className="px-4 py-3 text-sm text-gray-900">
            <div>{user.name}</div>
            <div className="font-medium truncate">{user.email}</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="avatarButton"
          >
            <DropdownItem to="/profile" icon={FaUser} text="Profile" />
            <DropdownItem to="/settings" icon={IoMdSettings} text="Usage" />
            <DropdownItem
              to="/subscriptions"
              icon={MdSubscriptions}
              text="Manage Subscription"
            />
          </ul>
          <div className="py-1">
            <Link
              onClick={logout}
              to="/logout"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-[#0080FF]"
            >
              <RiLogoutBoxFill className="h-4 w-4" /> Log out
            </Link>
            {/* <DropdownItem
              onClick={logout}
              icon={RiLogoutBoxFill}
              text="Log out"
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line
const DropdownItem = ({ to, icon: Icon, text, onClick }) => {
  const commonClasses =
    "flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-[#0080FF]";
  const content = (
    <>
      <Icon className="h-4 w-4" /> {text}
    </>
  );

  return onClick ? (
    <button onClick={onClick} className={commonClasses}>
      {content}
    </button>
  ) : (
    <Link to={to} className={commonClasses}>
      {content}
    </Link>
  );
};

export default Profile;

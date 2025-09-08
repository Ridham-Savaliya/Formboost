import { HiMenu } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa6"; // Arrow pointing left icon
import Profile from "./Profile";
import { CiSearch } from "react-icons/ci";
import logo from "../assets/logos/formboost-high-resolution-logo-transparent.png";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ toggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    toggleSidebar(); // This will trigger the sidebar toggle in the parent
    setIsSidebarOpen(!isSidebarOpen); // Update the state to reflect the sidebar status
  };

  return (
    <nav className="bg-white shadow-md p-4 h-16 fixed top-0 left-0 right-0 z-30 navbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 font-semibold ">
          <button
            onClick={handleToggleSidebar}
            className="togglebtn space-x-3 text-[#0080ff] relative"
          >
            {/* Wrapper for icon transition */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Hamburger icon */}
              <HiMenu
                className={`h-10 w-10 absolute transition-opacity duration-500 ease-in-out transform ${
                  isSidebarOpen ? "opacity-0" : "opacity-100"
                }`}
                style={{ transition: "opacity 0.3s ease-in-out" }}
              />
              {/* Arrow icon */}
              <GiHamburgerMenu
                className={`h-9 w-9 absolute transition-opacity duration-500 ease-in-out transform ${
                  isSidebarOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{ transition: "opacity 0.3s ease-in-out" }}
              />
            </div>
          </button>

          <div>
            <img
              className="w-fit h-6 object-cover"
              src={logo}
              alt="logo"
              type="image/png"
              rel="image"
            />
          </div>

          <div
            id="searchbar"
            className="gap-5 border-[#0046D3] rounded-sm flex items-center"
          >
            <form
              action=""
              method="post"
              className="border border-[#0046D3] p-1 font-thin rounded-sm w-[20vw] flex justify-between ms-28"
            >
              <input
                type="text"
                placeholder="Search"
                className="search outline-none text-black ps-2"
              />
              <button>
                <CiSearch />
              </button>
            </form>
          </div>
        </div>
        <div id="profile" className="flex items-center space-x-4">
          <Profile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

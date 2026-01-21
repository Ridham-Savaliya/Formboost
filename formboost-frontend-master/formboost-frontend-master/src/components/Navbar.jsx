import { MenuIcon } from "./OptimizedIcons";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";

const Logo = "https://res.cloudinary.com/dsqpc6sp6/image/upload/v1768281681/formboom_horizontally-removebg-_cypez2.png";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-3 h-16 sm:h-[68px] fixed top-0 left-0 right-0 z-30 flex items-center justify-between safe-pt safe-px">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        {/* Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          {/* Mobile Logo (Icon Only) */}
          <div className="sm:hidden flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-[#0080FF]/20">
              <HiOutlineSparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Desktop Logo */}
          <img
            src={Logo}
            alt="Formboom"
            className="hidden sm:block w-40 md:w-48 lg:w-52 h-auto"
          />
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            Dashboard
          </Link>
        </div>

        {/* Profile */}
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar;

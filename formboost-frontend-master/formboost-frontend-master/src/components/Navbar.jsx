import { MenuIcon } from "./OptimizedIcons";
import Profile from "./Profile";
import { Link } from "react-router-dom";

const Logo = "https://res.cloudinary.com/dsqpc6sp6/image/upload/v1768281681/formboom_horizontally-removebg-_cypez2.png";

// eslint-disable-next-line
const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md px-3 py-2 sm:px-4 sm:py-3 h-14 sm:h-16 fixed top-0 left-0 right-0 z-30 flex items-center justify-between safe-pt safe-px">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 -ml-1 sm:ml-0"
          >
            <MenuIcon className="w-6 h-6 m-3" />
          </button>

          <Link to="/" className="block">
            <img src={Logo} alt="Formboom" className="w-36 sm:w-52 md:w-56 h-auto" />
          </Link>
        </div>
      </div>
      <div className="flex m-4 items-center space-x-3 sm:space-x-4">
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar;

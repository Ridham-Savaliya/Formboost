import { HiMenu } from "react-icons/hi";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Logo_PNG.png";

// eslint-disable-next-line
const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md p-4 h-16 fixed top-0 left-0 right-0 z-30 flex justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800"
          >
            <HiMenu className="w-6 h-6 mr-4" />
          </button>

          <Link to="/" className="">
            <img src={Logo} alt="Logo" className="w-40" />
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Profile />
      </div>
    </nav>
  );
};

export default Navbar;

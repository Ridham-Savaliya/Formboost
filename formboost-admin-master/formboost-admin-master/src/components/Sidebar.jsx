import { HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { RiUserLine } from "react-icons/ri";
import { TbBasketQuestion } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { GrUpgrade } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import { useLogout } from "../../src/services/Authservices";

const Sidebar = ({ isOpen, toggleSidebar, toggleModal, closeSidebar }) => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      // Adjust this breakpoint if necessary
      closeSidebar();
    }
  };

  return (
    <div
      className={`sidebar modal-scroll fixed lg:absolute top-0 left-0 z-20 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ overflowY: "auto" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sidebar</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 lg:hidden"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-2 mt-10">
          <Link
            to={"/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <RxDashboard />
            <span>Dashboard</span>
          </Link>

          <Link
            to={"/users/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <RiUserLine />
            <span>Users</span>
          </Link>

          <Link
            to={"/forms/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <FaWpforms />
            <span>Forms</span>
          </Link>

          <Link
            to={"/manage-admin/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <RiAdminLine />
            <span>Manage Admin</span>
          </Link>

          <Link
            to={"/GlobalSettings/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <CiSettings />
            <span>Global Settings</span>
          </Link>

          <Link
            to={"/plans/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <TbBasketQuestion />
            <span>Plans</span>
          </Link>

          <Link
            to={"/transactions/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <MdOutlinePayment />
            <span>Transactions</span>
          </Link>

          <Link
            to={"/subscriptions/"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <GrUpgrade />
            <span>Subscription</span>
          </Link>

          <Link
            to={"/login"}
            onClick={handleLinkClick}
            className="ms-2 flex items-center gap-2 text-[#012970] font-medium p-3 rounded-md shadow-sm bg-[#f6f9ff] hover:text-[#4154f1]"
          >
            <FaWpforms />
            <button onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

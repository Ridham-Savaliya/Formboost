import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default to false for mobile
  const [modalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // Close the sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Adjust this breakpoint if necessary
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen ">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          closeSidebar={() => setSidebarOpen(false)} // Add this prop
        />
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 modal-scroll ease-in-out ${
            sidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

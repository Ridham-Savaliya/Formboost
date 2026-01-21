import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import CreateForm from "./CreateForm";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      setSidebarOpen(largeScreen);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const closeSidebar = () => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Fixed Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Main Layout Container */}
      <div className="flex pt-16 sm:pt-[68px]">
        {/* Fixed Sidebar - Stays in place when scrolling */}
        <div className={`fixed top-16 sm:top-[68px] left-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-68px)] z-20 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleModal={toggleModal}
            isLargeScreen={isLargeScreen}
          />
        </div>

        {/* Main Content - Scrollable */}
        <main
          className={`flex-1 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-68px)] overflow-y-auto transition-all duration-300 ease-out ${sidebarOpen && isLargeScreen ? "lg:ml-72" : "ml-0"
            }`}
          onClick={closeSidebar}
        >
          {children}
        </main>
      </div>

      {/* Create Form Modal */}
      <CreateForm showModal={modalOpen} toggleModal={toggleModal} />
    </div>
  );
};

export default Layout;

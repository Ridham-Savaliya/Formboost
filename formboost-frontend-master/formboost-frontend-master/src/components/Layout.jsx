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
    <div className="flex flex-col h-screen safe-px">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          isLargeScreen={isLargeScreen}
        />
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${
            sidebarOpen && isLargeScreen ? "lg:ml-64" : "ml-0"
          }`}
          onClick={closeSidebar}
        >
          <div className="px-3 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 no-scrollbar">{children}</div>
        </main>
      </div>
      <CreateForm showModal={modalOpen} toggleModal={toggleModal} />
    </div>
  );
};

export default Layout;

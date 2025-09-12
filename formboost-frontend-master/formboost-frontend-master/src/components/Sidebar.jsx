import { useEffect, useState } from "react";
import { HiX, HiPlus } from "react-icons/hi";
import {
  MdOutlineFormatAlignCenter,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import CreateForm from "./CreateForm";
import { useRecoilState } from "recoil";
import { formListState } from "../recoil/states";

export const Sidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  isLargeScreen,
}) => {
  const [userId, setUserId] = useState(null);
  const [forms, setForms] = useRecoilState(formListState);
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUserId = decodeTokenUserId(token);
      setUserId(decodedUserId);
    }

    const getFormDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${userId}/forms`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setForms(response.data.data);
      } catch (error) {
        console.error("Failed to fetch form details:", error);
      }
    };

    const fetchCurrentPlan = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/userplan/plan`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        if (data.success && data.data) {
          console.log(data.data.Plan.name);
          if (data.data.Plan.name === "Basic") {
            setHasPlan(false);
          } else {
            setHasPlan(true);
          }
        } else {
          // User has no active subscription - default to no plan
          setHasPlan(false);
        }

        console.log(hasPlan);
      } catch (error) {
        console.error("Failed to fetch current plan:", error);
        // If error is due to no active subscription, default to no plan
        if (error.response?.data?.message?.includes("no active subscription")) {
          setHasPlan(false);
        }
      }
    };

    if (userId) {
      getFormDetails();
      fetchCurrentPlan();
    }
  }, [userId, setForms]);

  const handleItemClick = (action) => {
    if (!isLargeScreen) {
      toggleSidebar();
    }
    if (action) {
      action();
    }
  };

  const handleFormCreated = (newForm) => {
    setForms((prevForms) => [...prevForms, newForm]);
  };

  const toggleCreateFormModal = () => {
    setShowCreateFormModal(!showCreateFormModal);
  };

  return (
    <>
      {(!isLargeScreen || isOpen) && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden ${
            isOpen ? "block" : "hidden"
          }`}
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed lg:absolute top-0 left-0 z-20 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="flex-grow overflow-y-auto">
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
            <div className="space-y-4 mt-8">
              <Link
                to={"/dashboard"}
                className={`flex items-center justify-between p-3 rounded-md shadow-sm transition-colors duration-200 ${
                  location.pathname === "/dashboard"
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-primary/10"
                }`}
                onClick={() => handleItemClick()}
              >
                <span>Dashboard</span>
                <MdOutlineSpaceDashboard
                  className={
                    location.pathname === "/dashboard" ? "text-white" : ""
                  }
                />
              </Link>
              <button
                className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm w-full hover:bg-primary/10"
                onClick={() => handleItemClick(toggleCreateFormModal)}
              >
                <span>Create Form</span>
                <HiPlus className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>

              <div className="border-b bg-gray-200" />
              {forms.map((form) => (
                <Link
                  key={form.id}
                  to={`/dashboard/form/${form.id}`}
                  className={`flex items-center justify-between p-3 rounded-md shadow-sm transition-colors duration-200 ${
                    location.pathname === `/dashboard/form/${form.id}`
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-primary/10"
                  }`}
                  onClick={() => handleItemClick()}
                >
                  <span>{form.formName}</span>
                  <MdOutlineFormatAlignCenter
                    className={
                      location.pathname === `/dashboard/form/${form.id}`
                        ? "text-white"
                        : ""
                    }
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* {!hasPlan && (
          <div className="p-4 bg-gray-100 shadow-lg">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
              <p className="text-gray-500">Unlock more features</p>
              <Link to="/subscriptions">
                <button
                  className="w-full mt-4 bg-[#0080FF] hover:bg-blue-800 text-white py-2 rounded-md"
                  onClick={() => handleItemClick()}
                >
                  Upgrade Now
                </button>
              </Link>
            </div>
          </div>
        )} */}
      </div>
      <CreateForm
        showModal={showCreateFormModal}
        toggleModal={toggleCreateFormModal}
        onFormCreated={handleFormCreated}
      />
    </>
  );
};

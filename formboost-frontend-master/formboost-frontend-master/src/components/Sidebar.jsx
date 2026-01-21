import { useEffect, useState } from "react";
import {
  HiX,
  HiPlus,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineSparkles,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
} from "react-icons/hi";
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
  const [formsExpanded, setFormsExpanded] = useState(true);
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
          if (data.data.Plan.name === "Basic") {
            setHasPlan(false);
          } else {
            setHasPlan(true);
          }
        } else {
          setHasPlan(false);
        }
      } catch (error) {
        console.error("Failed to fetch current plan:", error);
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

  const isActive = (path) => location.pathname === path;
  const isFormActive = (formId) => location.pathname === `/dashboard/form/${formId}`;

  return (
    <>
      {/* Create Form Modal - Rendered at top level for proper centering */}
      <CreateForm
        showModal={showCreateFormModal}
        toggleModal={toggleCreateFormModal}
        onFormCreated={handleFormCreated}
      />

      {/* Backdrop for mobile */}
      {!isLargeScreen && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container - Fixed height, internal scroll */}
      <div className="w-72 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/80 flex flex-col relative overflow-hidden z-20">
        {/* Decorative Gradient Orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0080FF]/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-24 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-[#0080FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm relative z-10">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#0080FF]/20 group-hover:shadow-xl group-hover:shadow-[#0080FF]/30 transition-all duration-300">
                <HiOutlineSparkles className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Formboom
              </span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
          {/* Navigation */}
          <div className="p-4 space-y-2">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive("/dashboard")
                ? "bg-gradient-to-r from-[#0080FF] to-blue-600 text-white shadow-lg shadow-[#0080FF]/30"
                : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => handleItemClick()}
            >
              <HiOutlineHome className={`w-5 h-5 mr-3 ${isActive("/dashboard") ? "text-white" : "text-gray-500 group-hover:text-[#0080FF]"}`} />
              <span className="font-semibold">Dashboard</span>
            </Link>

            {/* Create Form Button */}
            <button
              className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-[#0080FF]/10 hover:to-blue-600/10 border-2 border-dashed border-gray-200 hover:border-[#0080FF]/50 transition-all duration-200 group"
              onClick={() => handleItemClick(toggleCreateFormModal)}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0080FF]/10 to-blue-600/10 flex items-center justify-center mr-3 group-hover:from-[#0080FF]/20 group-hover:to-blue-600/20 transition-all">
                <HiPlus className="w-4 h-4 text-[#0080FF]" />
              </div>
              <span className="font-semibold text-gray-600 group-hover:text-[#0080FF]">Create New Form</span>
            </button>
          </div>

          {/* Forms Section */}
          <div className="px-4 pb-4">
            {/* Section Header */}
            <button
              onClick={() => setFormsExpanded(!formsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
            >
              <span>Your Forms ({forms.length})</span>
              {formsExpanded ? (
                <HiOutlineChevronDown className="w-4 h-4" />
              ) : (
                <HiOutlineChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Forms List */}
            {formsExpanded && (
              <div className="mt-2 space-y-1.5">
                {forms.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <HiOutlineDocumentText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No forms yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first form to get started</p>
                  </div>
                ) : (
                  forms.map((form) => (
                    <Link
                      key={form.id}
                      to={`/dashboard/form/${form.id}`}
                      className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${isFormActive(form.id)
                        ? "bg-[#0080FF]/10 text-[#0080FF] border border-[#0080FF]/20"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                      onClick={() => handleItemClick()}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-xs font-bold transition-all ${isFormActive(form.id)
                        ? "bg-[#0080FF] text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 group-hover:bg-[#0080FF]/10 group-hover:text-[#0080FF]"
                        }`}>
                        {form.formName?.charAt(0)?.toUpperCase() || "F"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isFormActive(form.id) ? "text-[#0080FF]" : "text-gray-700"}`}>
                          {form.formName}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Settings (Fixed at bottom) */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm relative z-10">
          <Link
            to="/dashboard/settings"
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname.includes("/settings")
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => handleItemClick()}
          >
            <HiOutlineCog className={`w-5 h-5 mr-3 ${location.pathname.includes("/settings") ? "text-gray-700" : "text-gray-400 group-hover:text-gray-600"}`} />
            <span className="font-medium">Settings</span>
          </Link>

          {/* Upgrade Banner for Basic Users */}
          {!hasPlan && (
            <div className="mt-3 p-4 bg-gradient-to-br from-[#0080FF]/5 to-purple-500/5 rounded-xl border border-[#0080FF]/10">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <HiOutlineSparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upgrade to Pro</p>
                  <p className="text-xs text-gray-500">Unlock all features</p>
                </div>
              </div>
              <Link to="/subscriptions">
                <button
                  className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-[#0080FF] to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-[#0070E0] hover:to-blue-700 transition-all duration-200 shadow-md shadow-[#0080FF]/20 hover:shadow-lg hover:shadow-[#0080FF]/30"
                  onClick={() => handleItemClick()}
                >
                  Upgrade Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

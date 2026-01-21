import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import UserSettings from "../components/UserSettings";
import TabComponent from "../components/TabComponent";
import { FormCard } from "../components/FormCard";
import CreateForm from "../components/CreateForm";
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import { useRecoilState } from "recoil";
import { formListState } from "../recoil/states";
import { Toaster } from "sonner";
import { LazyCharts } from "../components/LazyLoader";
import FormStatsCard from "../components/FormStatsCard";
import NotificationLimits from "../components/NotificationLimits";
import PrebuiltForms from "../components/PrebuiltForms";
import EmailDelayBanner from "../components/EmailDelayBanner";
import {
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineClipboardList,
  HiOutlinePresentationChartLine,
  HiOutlineTemplate,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineArrowRight
} from "react-icons/hi";

export const UserDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [forms, setForms] = useRecoilState(formListState);
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUserId = decodeTokenUserId(token);
      setUserId(decodedUserId);
    }

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!userId) return;

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

        const rows = Array.isArray(response.data.data) ? response.data.data : [];
        const withTemplates = rows.map((f) => {
          let parsed = null;
          if (f && f.prebuiltTemplate) {
            try {
              parsed = typeof f.prebuiltTemplate === 'string' ? JSON.parse(f.prebuiltTemplate) : f.prebuiltTemplate;
            } catch (e) {
              parsed = null;
            }
          }
          return { ...f, template: parsed };
        });
        setForms(withTemplates);
      } catch (error) {
        console.error("Failed to fetch form details:", error);
      }
    };

    if (userId) {
      getFormDetails();
    }
  }, [setForms, userId]);

  const handleDelete = async (formId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setForms(forms.filter((form) => form.id !== formId));
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const handleFormCreated = (newForm) => {
    const parsed = newForm?.template || (newForm?.prebuiltTemplate ? (() => { try { return JSON.parse(newForm.prebuiltTemplate); } catch { return null; } })() : null);
    setForms((prevForms) => [...prevForms, { ...newForm, template: parsed }]);
  };

  const filteredForms = forms.filter(form =>
    form.formName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.formDescription?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDashboardContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#0080FF]/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-[#0080FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tl from-indigo-500/10 to-[#0080FF]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Header */}
        <div className="mb-8 mt-4 sm:mt-8 md:mt-12">
          <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0080FF] via-blue-600 to-indigo-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            {/* Floating Shapes */}
            <div className="absolute top-8 right-12 w-24 h-24 bg-white/10 rounded-2xl rotate-12 blur-sm hidden md:block" />
            <div className="absolute bottom-4 right-32 w-16 h-16 bg-white/10 rounded-xl -rotate-12 blur-sm hidden md:block" />
            <div className="absolute top-12 right-48 w-20 h-20 bg-white/5 rounded-full blur-sm hidden lg:block" />

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Side */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                    <HiOutlinePresentationChartLine className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm sm:text-base font-medium mb-1">{greeting} 👋</p>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                      Your Dashboard
                    </h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/70 max-w-md">
                      Manage forms, track submissions & grow your audience
                    </p>
                  </div>
                </div>

                {/* Right Side - Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <HiOutlineClipboardList className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white">{forms.length}</div>
                        <div className="text-xs sm:text-sm text-white/70 font-medium">Total Forms</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[120px] sm:min-w-[140px] bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-400/30 rounded-xl">
                        <HiOutlineLightningBolt className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white">Active</div>
                        <div className="text-xs sm:text-sm text-white/70 font-medium">Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Delay Banner */}
        <EmailDelayBanner />

        {/* Stats and Limits Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <FormStatsCard />
          </div>
          <div className="xl:col-span-1">
            <NotificationLimits userId={userId} />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-6 lg:p-8">
            <LazyCharts />
          </div>
        </div>

        {/* Prebuilt Forms Section */}
        <div className="mb-8">
          <PrebuiltForms onFormCreated={handleFormCreated} />
        </div>

        {/* Forms Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Section Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-[#0080FF]/10 to-blue-600/10 rounded-xl">
                    <HiOutlineTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-[#0080FF]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Forms</h2>
                    <p className="text-sm text-gray-500">Manage and organize your collection</p>
                  </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:flex-none">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all"
                    />
                  </div>

                  {/* Forms Count Badge */}
                  <div className="hidden sm:flex items-center px-4 py-2 bg-[#0080FF]/5 rounded-xl border border-[#0080FF]/20">
                    <span className="text-sm font-semibold text-[#0080FF]">
                      {forms.length} form{forms.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Forms Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {forms.length === 0 ? (
                /* Empty State */
                <div className="text-center py-12 sm:py-16">
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0080FF]/20 to-purple-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-2 bg-gradient-to-br from-[#0080FF]/10 to-blue-600/10 rounded-full" />
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <HiOutlinePlus className="w-10 h-10 sm:w-12 sm:h-12 text-[#0080FF]" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm sm:text-base">
                    Get started by creating your first form using our beautiful pre-built templates or start from scratch.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0080FF] to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-[#0080FF]/30 hover:shadow-xl hover:shadow-[#0080FF]/40 transition-all duration-300 transform hover:-translate-y-0.5">
                      <HiOutlineSparkles className="w-5 h-5 mr-2" />
                      Use a Template
                      <HiOutlineArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ) : filteredForms.length === 0 ? (
                /* No Search Results */
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <HiOutlineSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No forms found</h3>
                  <p className="text-gray-500">No forms match "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[#0080FF] font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                /* Forms Grid */
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {filteredForms.map((form, index) => (
                    <div
                      key={form.id}
                      className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:border-[#0080FF]/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Top Gradient Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0080FF] to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <FormCard
                        title={form.formName}
                        formDescription={form.formDescription}
                        createdDate={form.createdAt}
                        formId={form.id}
                        alias={form.alias}
                        onDelete={handleDelete}
                        onView={() => navigate(`/dashboard/form/${form.id}`)}
                        template={form.template}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <Toaster richColors position="top-center" closeButton theme="light" />
      <Routes>
        <Route index element={renderDashboardContent()} />
        <Route path="profile" element={<UserSettings />} />
        <Route path="settings" element={<UserSettings userId={userId} />} />
        <Route path="subscriptions" element={<UserSettings userId={userId} />} />
        {forms.map((form) => (
          <Route
            key={form.id}
            path={`form/${form.id}`}
            element={
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 pt-20 relative">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#0080FF]/10 to-purple-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 -left-24 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-[#0080FF]/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0080FF] via-blue-600 to-indigo-600" />
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

                      <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                        <div className="flex items-start gap-4 sm:gap-6">
                          <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30">
                            <HiOutlineClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                              {form.formName}
                            </h1>
                            <p className="text-white/70 mt-1 text-sm sm:text-base line-clamp-2">
                              {form.formDescription.length > 100
                                ? `${form.formDescription.substring(0, 100)}...`
                                : form.formDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                      <TabComponent
                        alias={form.alias}
                        formId={form.id}
                        formName={form.formName}
                        template={form.template}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </Routes>
      <CreateForm onFormCreated={handleFormCreated} />
    </Layout>
  );
};

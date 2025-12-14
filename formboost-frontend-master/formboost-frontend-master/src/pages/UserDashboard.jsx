import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import UserSettings from "../components/UserSettings";
import TabComponent from "../components/TabComponent";
import { FormCard } from "../components/FormCard";
import CreateForm from "../components/CreateForm"; // Import CreateForm
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import { useRecoilState } from "recoil";
import { formListState } from "../recoil/states";
import { ToastContainer } from "react-toastify";
import { LazyCharts } from "../components/LazyLoader";
import FormStatsCard from "../components/FormStatsCard";
import NotificationLimits from "../components/NotificationLimits";
import PrebuiltForms from "../components/PrebuiltForms";
import EmailDelayBanner from "../components/EmailDelayBanner";

export const UserDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [forms, setForms] = useRecoilState(formListState);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUserId = decodeTokenUserId(token);
      setUserId(decodedUserId);
    }
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
    // Normalize template on create as well
    const parsed = newForm?.template || (newForm?.prebuiltTemplate ? (() => { try { return JSON.parse(newForm.prebuiltTemplate); } catch { return null; } })() : null);
    setForms((prevForms) => [...prevForms, { ...newForm, template: parsed }]);
  };

  const renderDashboardContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 mt-2 sm:mt-8 md:mt-10 lg:mt-10">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-primary/10 p-5 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="p-2.5 sm:p-3 bg-primary rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md shadow-primary/20">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-lg text-gray-600 font-medium">Manage your forms & analytics</p>
                </div>
              </div>

              {/* Desktop Stats */}
              <div className="hidden md:flex items-center space-x-6 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{forms.length}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Forms</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                </div>
              </div>

              {/* Mobile Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:hidden">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <div className="text-xl font-bold text-primary">{forms.length}</div>
                  <div className="text-xs font-medium text-gray-500">Total Forms</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <div className="text-xl font-bold text-green-600">Active</div>
                  <div className="text-xs font-medium text-gray-500">Status</div>
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
          <Card>
            <LazyCharts />
          </Card>
        </div>

        {/* Prebuilt Forms Section */}
        <div className="mb-8">
          <PrebuiltForms onFormCreated={handleFormCreated} />
        </div>

        {/* Forms Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-primary/10 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-sm">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Forms</h2>
                  <p className="text-sm sm:text-base text-gray-600">Manage your collection</p>
                </div>
              </div>
              <div className="bg-primary/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-primary/20 self-start sm:self-auto">
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {forms.length} form{forms.length !== 1 ? "s" : ""} created
                </span>
              </div>
            </div>

            {/* No Forms */}
            {forms.length === 0 ? (
              <div className="text-center py-10 sm:py-16 bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-primary/30 px-4">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No forms yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first form using our premium templates above.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
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
  );

  return (
    <Layout>
      <ToastContainer />
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
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-primary-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden">
                    <div className="bg-primary px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-white">{form.formName}</h1>
                          <p className="text-white/80 mt-1">
                            {form.formDescription.length > 100
                              ? `${form.formDescription.substring(0, 80)}...`
                              : form.formDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 md:p-4 lg:p-8">
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

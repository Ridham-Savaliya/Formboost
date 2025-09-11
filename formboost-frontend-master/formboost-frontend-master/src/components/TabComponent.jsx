import { useState } from "react";
import SubmissionTab from "./SubmissionTab";
import SetupTab from "./SetupTab";
import AnalyticsTab from "./AnalyticsTab";
import { WorkflowTab } from "./WorkflowTab";
import FormSettingsTab from "./FormSettingsTab";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formListState } from "../recoil/states";
import { useRecoilState } from "recoil";

const TabComponent = ({ alias, formId, formName, template }) => {
  const [activeTab, setActiveTab] = useState("submissions");

  const [forms, setForms] = useRecoilState(formListState);

  const navigate = useNavigate();

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
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const tabs = [
    { id: "submissions", title: "Submissions" },
    { id: "setup", title: "Setup" },
    { id: "analytics", title: "Analytics" },
    { id: "workflow", title: "Workflow" },
    { id: "settings", title: "Settings" },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-2 border border-gray-200">
          <ul className="flex flex-nowrap space-x-2" role="tablist">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex-1" role="presentation">
                <button
                  className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white hover:shadow-md"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {tab.id === 'submissions' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {tab.id === 'setup' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {tab.id === 'analytics' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {tab.id === 'workflow' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {tab.id === 'settings' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    <span>{tab.title}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
            className={`p-4 rounded-lg ${activeTab === tab.id ? "" : "hidden"}`}
          >
            {tab.title === "Submissions" && <SubmissionTab formId={formId} />}

            {tab.title === "Setup" && <SetupTab alias={alias} template={template} />}

            {tab.title === "Analytics" && <AnalyticsTab formId={formId} />}

            {tab.title === "Workflow" && <WorkflowTab formId={formId} />}

            {tab.title === "Settings" && (
              <FormSettingsTab
                formName={formName}
                onDelete={handleDelete}
                formId={formId}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;

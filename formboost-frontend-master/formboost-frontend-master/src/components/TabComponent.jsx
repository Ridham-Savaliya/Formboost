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
import { Loader2 } from "lucide-react";

const TabComponent = ({ alias, formId, formName, template }) => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [forms, setForms] = useRecoilState(formListState);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async (formId) => {
    try {
      setLoadingDelete(true);
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
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const tabs = [
    { id: "submissions", title: "Submissions", icon: "📩" },
    { id: "setup", title: "Setup", icon: "⚙️" },
    { id: "analytics", title: "Analytics", icon: "📊" },
    { id: "workflow", title: "Workflow", icon: "🔀" },
    { id: "settings", title: "Settings", icon: "🛠️" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="mb-3 sm:mb-4">
        <div className="bg-white shadow-md border border-gray-200 sticky top-14 z-20 rounded-xl">
          <ul
            className="flex overflow-x-auto no-scrollbar px-1 sm:px-2 lg:px-4"
            role="tablist"
          >
            {tabs.map((tab) => (
              <li key={tab.id} role="presentation" className="flex-shrink-0">
                <button
                  className={`flex items-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                >
                  <span className="text-sm sm:text-lg">{tab.icon}</span>
                  <span className="whitespace-nowrap text-xs sm:text-sm">{tab.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tab panels */}
      <div className="flex-1 overflow-y-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
            className={`rounded-lg ${
              activeTab === tab.id ? "" : "hidden"
            }`}
          >
            {tab.id === "submissions" && <SubmissionTab formId={formId} />}
            {tab.id === "setup" && (
              <SetupTab alias={alias} template={template} />
            )}
            {tab.id === "analytics" && <AnalyticsTab formId={formId} />}
            {tab.id === "workflow" && <WorkflowTab formId={formId} />}
            {tab.id === "settings" && (
              <FormSettingsTab
                formName={formName}
                onDelete={handleDelete}
                formId={formId}
                loading={loadingDelete}
                deleteButton={
                  <button
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-70"
                    disabled={loadingDelete}
                  >
                    {loadingDelete && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {loadingDelete ? "Deleting..." : "Delete Form"}
                  </button>
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;

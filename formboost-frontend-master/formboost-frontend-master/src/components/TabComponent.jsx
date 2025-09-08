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

const TabComponent = ({ alias, formId, formName }) => {
  const [activeTab, setActiveTab] = useState("submissions");

  const [forms, setForms] = useRecoilState(formListState);

  const navigate = useNavigate();

  const handleDelete = async (formId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/form/${formId}`,
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
      <div className="mb-4 border-b overflow-x-auto mt-4 md:mt-0">
        <ul
          className="flex flex-nowrap text-sm font-medium text-center whitespace-nowrap"
          role="tablist"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-shrink-0" role="presentation">
              <button
                className={`inline-block p-2 sm:p-4 border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#0080FF] text-[#0080FF] font-bold"
                    : "border-transparent hover:text-[#0080FF] hover:border-[#0080FF]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTab === tab.id}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
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

            {tab.title === "Setup" && <SetupTab alias={alias} />}

            {tab.title === "Analytics" && <AnalyticsTab formId={formId} />}

            {tab.title === "Workflow" && <WorkflowTab />}

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

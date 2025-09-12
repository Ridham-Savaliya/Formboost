import { LineChart } from "@mui/x-charts";
import { useRecoilState } from "recoil";
import { formSubmissionDataState } from "../recoil/states";
import { useEffect, useState } from "react";
import axios from "axios";

const AnalyticsTab = ({ formId }) => {
  const [formSubmissionData, setFormSubmissionData] = useRecoilState(
    formSubmissionDataState
  );

  const [submissionData, setSubmissionData] = useState([]);

  useEffect(() => {
    const getFormSubmissionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/formsubmission/${formId}/form`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setFormSubmissionData(response.data.data);
        setSubmissionData(response.data.data.submissions);
      } catch (error) {
        console.error("Failed to fetch form submission data:", error);
      }
    };

    if (formId) {
      getFormSubmissionData();
    }
  }, [formId, setFormSubmissionData, setSubmissionData]);

  return (
    <div className="p-2 sm:p-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-2">Overview</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="h-3 w-3 sm:h-4 sm:w-4 bg-[#0080FF] rounded-full inline-block"></span>
            <span className="text-sm sm:text-base">Total Submissions</span>
          </div>
        </div>
        <div>
          <select className="border border-gray-300 rounded px-2 py-1.5 sm:p-2 text-sm sm:text-base w-full sm:w-auto">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mb-4 sm:mb-6 w-full overflow-x-auto">
        {/* Chart rendering */}
        <div className="min-w-[280px] w-full max-w-full">
          <LineChart
            xAxis={[
              { scaleType: "band", data: submissionData.map((d) => d.date) },
            ]}
            series={[
              {
                data: submissionData.map((d) => d.submissionCount),
                color: "#0080FF",
              },
            ]}
            height={220}
            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="text-center bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xl sm:text-2xl font-bold text-[#0080FF] mb-1 sm:mb-2">
            {formSubmissionData.totalCount}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">TOTAL SUBMISSIONS</div>
          {/* <div className="text-gray-500">THIS MONTH</div> */}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

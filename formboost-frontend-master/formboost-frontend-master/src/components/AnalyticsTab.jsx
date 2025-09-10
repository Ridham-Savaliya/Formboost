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
    <div className="">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="h-4 w-4 bg-[#0080FF] rounded-full inline-block"></span>
            <span>Total Submissions</span>
          </div>
        </div>
        <div>
          <select className="border border-gray-300 rounded p-2">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mb-6 w-full">
        {/* Chart rendering */}
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
          height={300}
        />
      </div>

      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#0080FF]">
            {formSubmissionData.totalCount}
          </div>
          <div className="text-gray-500">TOTAL SUBMISSIONS</div>
          {/* <div className="text-gray-500">THIS MONTH</div> */}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

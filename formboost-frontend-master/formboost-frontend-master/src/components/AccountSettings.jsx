import { useEffect, useState } from "react";
import axios from "axios";

export const AccountSettings = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [quotaData, setQuotaData] = useState({
    totalForms: 0,
    createdForms: 0,
    monthlySubmissionLimit: 0,
    usedSubmissions: 0,
    quotaUsedPercentage: "0.00",
  });
  const [quotaError, setQuotaError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        const { success, data, message } = userResponse.data;

        if (success) {
          setUser(data);
        } else {
          throw new Error(message);
        }

        // Fetch quota information
        const quotaResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/formsubmission/Quota`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        if (quotaResponse.data.success) {
          setQuotaData(quotaResponse.data.data);
        } else {
          throw new Error(quotaResponse.data.message);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
        if (error.message.includes("user data")) {
          setError("Failed to fetch user data");
        } else {
          setQuotaError("Failed to fetch quota information");
        }
      }
    };

    fetchData();
  }, [userId]);

  const formUsagePercentage =
    (quotaData.createdForms / quotaData.totalForms) * 100;

  return (
    <div className="mx-auto bg-white rounded-lg ">
      {quotaError ? (
        <p className="text-red-500 text-sm">{quotaError}</p>
      ) : (
        <>
          {/* Forms Usage Progress Bar */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Forms Usage </h3>
            <div className="flex items-center mb-2">
              <span className="text-lg font-medium mr-2">
                {quotaData.createdForms}
              </span>
              <span className="text-gray-500">
                / {quotaData.totalForms} forms created
              </span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${formUsagePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Submissions Usage Progress Bar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Monthly Submissions </h3>
            <div className="flex items-center mb-2">
              <span className="text-lg font-medium mr-2">
                {quotaData.usedSubmissions}
              </span>
              <span className="text-gray-500">
                / {quotaData.monthlySubmissionLimit} submissions used
              </span>
            </div>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quotaData.quotaUsedPercentage}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountSettings;

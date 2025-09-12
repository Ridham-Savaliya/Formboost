import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { formStatsState } from "../recoil/states";
import axios from "axios";

const StatCard = ({ title, value, color, icon, subTitle }) => (
  <div className="bg-white rounded-md shadow-md p-4 sm:p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-lg font-bold text-gray-600 truncate">{title}</h3>
        <div className="text-xs text-gray-600">{subTitle}</div>
      </div>
      <span className={`text-xl sm:text-2xl ${color} flex-shrink-0 ml-2`}>{icon}</span>
    </div>
    <p className={`text-2xl sm:text-3xl font-bold ${color} truncate`}>{value}</p>
  </div>
);

const FormStatsCard = () => {
  const [stats, setStats] = useRecoilState(formStatsState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/dashboard`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setStats(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [setStats]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-32 sm:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md"
        role="alert"
      >
        <p className="font-bold text-sm sm:text-base">Error</p>
        <p className="text-sm sm:text-base">{error}</p>
      </div>
    );

  return (
    <div className="rounded-md w-full my-4 sm:my-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Forms"
          subTitle=""
          value={stats.totalForms}
          color="text-indigo-600"
          icon="📊"
        />
        <StatCard
          title="Submissions"
          subTitle="This Month"
          value={stats.totalSubmissionsThisMonth}
          color="text-green-600"
          icon="📅"
        />
        <StatCard
          title="Submissions"
          subTitle="Past Month"
          value={stats.totalSubmissionsLastMonth}
          color="text-amber-600"
          icon="🗓️"
        />
        <StatCard
          title="Submissions"
          subTitle="All Time"
          value={stats.totalSubmissionsAllTime}
          color="text-blue-600"
          icon="🏆"
        />
      </div>
    </div>
  );
};

export default FormStatsCard;

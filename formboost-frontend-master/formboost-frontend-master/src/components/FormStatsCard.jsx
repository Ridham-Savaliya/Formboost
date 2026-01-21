import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { formStatsState } from "../recoil/states";
import axios from "axios";
import {
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
  HiArrowUp,
  HiArrowDown
} from "react-icons/hi";

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend, trendValue }) => (
  <div className="relative group">
    {/* Card Background with Gradient Border */}
    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm"
      style={{ backgroundImage: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` }} />

    <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br shadow-lg`}
          style={{ backgroundImage: `linear-gradient(to bottom right, ${gradient[0]}, ${gradient[1]})` }}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {trend === 'up' ? (
              <HiArrowUp className="w-3 h-3" />
            ) : (
              <HiArrowDown className="w-3 h-3" />
            )}
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>

      {/* Title & Subtitle */}
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundImage: `linear-gradient(to right, ${gradient[0]}, ${gradient[1]})` }} />
    </div>
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

  // Calculate trend
  const calculateTrend = () => {
    const thisMonth = stats.totalSubmissionsThisMonth || 0;
    const lastMonth = stats.totalSubmissionsLastMonth || 0;
    if (lastMonth === 0) return { trend: null, value: null };
    const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
    return {
      trend: diff >= 0 ? 'up' : 'down',
      value: `${Math.abs(diff).toFixed(0)}%`
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
            <div className="h-10 bg-gray-200 rounded-lg mb-2 w-20" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <HiOutlineDocumentText className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold">Failed to load stats</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const trendData = calculateTrend();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Forms"
        subtitle="Active forms in your account"
        value={stats.totalForms || 0}
        icon={HiOutlineDocumentText}
        gradient={['#6366f1', '#8b5cf6']}
      />
      <StatCard
        title="This Month"
        subtitle="Submissions received"
        value={stats.totalSubmissionsThisMonth || 0}
        icon={HiOutlineCalendar}
        gradient={['#10b981', '#059669']}
        trend={trendData.trend}
        trendValue={trendData.value}
      />
      <StatCard
        title="Last Month"
        subtitle="Previous period comparison"
        value={stats.totalSubmissionsLastMonth || 0}
        icon={HiOutlineTrendingUp}
        gradient={['#f59e0b', '#d97706']}
      />
      <StatCard
        title="All Time"
        subtitle="Total submissions ever"
        value={stats.totalSubmissionsAllTime || 0}
        icon={HiOutlineMail}
        gradient={['#0080FF', '#0066cc']}
      />
    </div>
  );
};

export default FormStatsCard;

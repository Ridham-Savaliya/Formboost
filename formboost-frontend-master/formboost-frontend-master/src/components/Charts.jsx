import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import {
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiOutlineRefresh,
  HiOutlineChartBar
} from "react-icons/hi";

const Charts = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    counts: [],
  });
  const [loading, setLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [peakDay, setPeakDay] = useState({ date: '', count: 0 });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/formsubmission/User`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.data.success) {
          const submissions = response.data.data.submissions;
          const dates = submissions.map((item) => item.date);
          const counts = submissions.map((item) => item.submissionCount);
          setChartData({ dates, counts });

          // Calculate stats
          const total = counts.reduce((acc, curr) => acc + curr, 0);
          setTotalSubmissions(total);

          // Find peak day
          const maxCount = Math.max(...counts);
          const maxIndex = counts.indexOf(maxCount);
          if (maxIndex !== -1) {
            setPeakDay({ date: dates[maxIndex], count: maxCount });
          }
        }
      } catch (error) {
        console.error("Error fetching form responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartWidth = () => {
    if (isSmallScreen) return 320;
    if (isMediumScreen) return 550;
    return 750;
  };

  const getChartHeight = () => {
    if (isSmallScreen) return 280;
    return 350;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
        </div>
        {/* Chart Skeleton */}
        <div className="h-[350px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
          <HiOutlineChartBar className="w-16 h-16 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="inline-flex p-2 bg-gradient-to-br from-[#0080FF]/10 to-blue-600/10 rounded-xl">
              <HiOutlineTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#0080FF]" />
            </span>
            Submissions Over Time
          </h3>
          <p className="text-sm text-gray-500 mt-1">Track your form performance over the last 30 days</p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#0080FF]/5 to-blue-600/5 rounded-xl border border-[#0080FF]/10">
            <div className="p-1.5 bg-[#0080FF]/10 rounded-lg">
              <HiOutlineCalendar className="w-4 h-4 text-[#0080FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total</p>
              <p className="text-lg font-bold text-gray-900">{totalSubmissions}</p>
            </div>
          </div>

          {peakDay.count > 0 && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <HiOutlineTrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Peak Day</p>
                <p className="text-lg font-bold text-gray-900">{peakDay.count}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {chartData.dates.length > 0 ? (
          <div className="bg-gradient-to-br from-gray-50/50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
            {/* Chart Legend */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#0080FF] to-blue-500 shadow-sm shadow-blue-500/30" />
                <span className="text-xs font-medium text-gray-600">Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#0080FF]/30 to-blue-500/30" />
                <span className="text-xs font-medium text-gray-600">Area fill</span>
              </div>
            </div>

            {/* Chart */}
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-[320px]">
                <LineChart
                  xAxis={[
                    {
                      data: chartData.dates,
                      scaleType: "band",
                      tickLabelStyle: {
                        fontSize: isSmallScreen ? 10 : 12,
                        fill: '#6b7280',
                      },
                    },
                  ]}
                  series={[
                    {
                      data: chartData.counts,
                      area: true,
                      color: '#0080FF',
                      label: "Submissions",
                    },
                  ]}
                  width={getChartWidth()}
                  height={getChartHeight()}
                  sx={{
                    '.MuiLineElement-root': {
                      strokeWidth: 3,
                    },
                    '.MuiAreaElement-root': {
                      fill: 'url(#area-gradient)',
                      fillOpacity: 0.3,
                    },
                    '.MuiChartsAxis-line': {
                      stroke: '#e5e7eb',
                    },
                    '.MuiChartsAxis-tick': {
                      stroke: '#e5e7eb',
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <HiOutlineChartBar className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h4>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Start collecting form submissions to see your analytics here
            </p>
          </div>
        )}
      </div>

      {/* Insights Footer */}
      {chartData.dates.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
            <HiOutlineCalendar className="w-3.5 h-3.5" />
            Last {chartData.dates.length} days shown
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
            <HiOutlineRefresh className="w-3.5 h-3.5" />
            Auto-refreshed daily
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;

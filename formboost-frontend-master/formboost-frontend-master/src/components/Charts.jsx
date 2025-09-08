import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

const Charts = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    counts: [],
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/formsubmission/User`,
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
        }
      } catch (error) {
        console.error("Error fetching form responses:", error);
      }
    };

    fetchData();
  }, []);

  const getChartWidth = () => {
    if (isSmallScreen) return 300;
    if (isMediumScreen) return 600;
    return 800;
  };

  const getChartHeight = () => {
    if (isSmallScreen) return 300;
    return 400;
  };

  return (
    <div className="space-y-12 p-4">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Submissions Over Time</h3>
        {chartData.dates.length > 0 && (
          <LineChart
            xAxis={[
              {
                data: chartData.dates,
                scaleType: "band",
              },
            ]}
            series={[
              {
                data: chartData.counts,
                area: true,
                label: "Submissions",
              },
            ]}
            width={getChartWidth()}
            height={getChartHeight()}
          />
        )}
      </div>
    </div>
  );
};

export default Charts;

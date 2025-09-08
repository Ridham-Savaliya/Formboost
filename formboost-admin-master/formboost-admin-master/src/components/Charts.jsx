import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

export function Charts() {
  const [activeChart, setActiveChart] = React.useState("desktop");
  const [chartData, setChartData] = useState([]);
  
  // Fetch and process data from API
  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/formsubmission`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data.success) {
          // Transform data to count submissions per date
          const dataByDate = response.data.data.rows.reduce((acc, curr) => {
            const date = new Date(curr.submittedAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
          
          // Format data for recharts
          const formattedData = Object.keys(dataByDate).map(date => ({
            date,
            count: dataByDate[date],
          }));
          
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };
    
    fetchSubmissionData();
  }, []);

  return (
    <Card >
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle><span className="text-xl font-bold text-[#0080ff]">Total Submissions</span></CardTitle>
          <CardDescription>
            Showing total submissions per day
          </CardDescription>
        </div>
        <div className="flex">
          {["count"].map((key) => {
            return (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">Submissions</span>
                <span className="text-lg font-bold leading-none sm:text-3xl text-[#0080ff]">
                  {chartData.reduce((total, item) => total + item.count, 0).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full text-[#0080ff]"
        >
          <BarChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="Submissions"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="count" fill="#0080ff" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

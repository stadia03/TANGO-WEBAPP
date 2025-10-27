import { useState, useEffect } from "react";
import api from '../axiosConfig';
import React from "react"; // Ensure React is imported if using JSX
import DailyReportDisplay from "./DailyReportDisplay";
import MonthlyViewDisplay from "./MonthlyViewDisplay";
import { DailyReportType } from "../types/DailyReport";
// Define the type for the report data to improve type safety



// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"day" | "month">("day");
  const [isMobile, setIsMobile] = useState(false);
  const [todayReport, setTodayReport] = useState<DailyReportType | undefined>();

  const fetchTodaysReport = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/latest-report`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTodayReport(response.data);
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error fetching report", error);
        alert("An error occurred while fetching today's report");
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return;  
    fetchTodaysReport();

    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      {isMobile ? (
        <div>
          <div className="flex border border-gray-600 rounded-md overflow-hidden mb-2">
            <button
              className={`flex-1 px-4 py-2 text-center text-sm font-semibold ${
                activeTab === "day"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("day")}
            >
              TODAY
            </button>
            <button
              className={`flex-1 px-4 py-2 text-center text-sm font-semibold ${
                activeTab === "month"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("month")}
            >
              MONTHLY
            </button>
          </div>

          {activeTab === "day" ? (
            <DailyReportDisplay report={todayReport} />
          ) : (
            <MonthlyViewDisplay />
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-300 p-4 rounded-lg ">
            <DailyReportDisplay report={todayReport} />
          </div>

          <div className="w-[2px] bg-gray-500"></div>

          <div className="flex-1 bg-gray-200 p-4 rounded space-y-4">
            <MonthlyViewDisplay />
          </div>
        </div>
      )}
    </div>
  );
}
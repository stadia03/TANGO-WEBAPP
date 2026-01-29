import { useState, useEffect } from "react";
import api from "../axiosConfig";
import React from "react"; 
import DailyReportDisplay from "./DailyReportDisplay";
import MonthlyViewDisplay from "./MonthlyViewDisplay";
import { DailyReportType } from "../types/DailyReport";
import YearlyViewDisplay from "./YearlyViewDisplay";

// --- PLACEHOLDER FOR YOUR FUTURE COMPONENT ---
// Once you create "YearlyViewDisplay.tsx", remove this const 
// and import the real component instead.

// ---------------------------------------------

export default function Dashboard() {
  // 1. Update state type to include "year"
  const [activeTab, setActiveTab] = useState<"day" | "month" | "year">("day");
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
    // 2. Update local storage logic to handle "year"
    const savedTab = localStorage.getItem("activeTab") as "day" | "month" | "year" | null;
    if (savedTab) {
      setActiveTab(savedTab);
    }
    if (!localStorage.getItem("token")) return;
    fetchTodaysReport();

    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024); // Increased breakpoint for 3 columns
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Helper to handle tab switching
  const handleTabChange = (tab: "day" | "month" | "year") => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      {isMobile ? (
        /* ============ MOBILE VIEW ============ */
        <div>
          <div className="flex border border-gray-600 rounded-md overflow-hidden mb-2">
            <button
              className={`flex-1 px-2 py-2 text-center text-xs font-semibold ${
                activeTab === "day"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-700 border-r border-gray-400"
              }`}
              onClick={() => handleTabChange("day")}
            >
              TODAY
            </button>
            <button
              className={`flex-1 px-2 py-2 text-center text-xs font-semibold ${
                activeTab === "month"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-700 border-r border-gray-400"
              }`}
              onClick={() => handleTabChange("month")}
            >
              MONTHLY
            </button>
            <button
              className={`flex-1 px-2 py-2 text-center text-xs font-semibold ${
                activeTab === "year"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => handleTabChange("year")}
            >
              YEARLY
            </button>
          </div>

          {/* Mobile Content Switcher */}
          {activeTab === "day" && <DailyReportDisplay report={todayReport} />}
          {activeTab === "month" && <MonthlyViewDisplay />}
          {activeTab === "year" && <YearlyViewDisplay />}
        </div>
      ) : (
        /* ============ DESKTOP VIEW (3 Columns) ============ */
        <div className="flex gap-4 items-start">
          {/* Column 1: Daily */}
          <div className="flex-1 bg-gray-300 p-4 rounded-lg shadow-sm">
            <DailyReportDisplay report={todayReport} />
          </div>

          {/* Separator 1 */}
          <div className="w-[2px] self-stretch bg-gray-400/50 rounded-full"></div>

          {/* Column 2: Monthly */}
          <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-sm">
            <MonthlyViewDisplay />
          </div>

          {/* Separator 2 */}
          <div className="w-[2px] self-stretch bg-gray-400/50 rounded-full"></div>

          {/* Column 3: Yearly */}
          <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-sm">
            <YearlyViewDisplay />
          </div>
        </div>
      )}
    </div>
  );
}
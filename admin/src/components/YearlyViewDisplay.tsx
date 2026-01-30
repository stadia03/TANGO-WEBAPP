import React, { useEffect, useState } from "react";
import api from "../axiosConfig"; // Adjust path as needed
import formatMoney from "../utils/formatMoney"; // Adjust path as needed
import { MonthlyReportItem, RangeSummaryData } from "../types/DailyReport";

// --- Type Definitions based on your JSON response ---




// Helper to get month name
const getMonthName = (monthNumber: number) => {
  const date = new Date(2020, monthNumber - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long" });
};


// Reusable Summary Grid Component to avoid code duplication
// We use this for the Top Combined View AND the Modal Detail View
const SummaryGrid = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-2 gap-y-1 text-sm md:text-base border p-2 rounded bg-white">
      <div className="font-semibold text-gray-700 px-2">Total Revenue:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalMonthRevenue?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        UPI Deposit:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(data.totalUpiDeposit?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 px-2">Cash Received:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalCashReceived?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Room Sold:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {data.totalRoomSold ?? "-"}
      </div>

      <div className="font-semibold text-gray-700 px-2">Total Pax:</div>
      <div className="text-gray-900 text-right px-2">
        {data.totalAdult ?? "-"} adults, {data.totalChild ?? "-"} childs
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Avg Occupancy:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {data.avgOccupancy?.toFixed(2) ?? "-"}%
      </div>

      <div className="font-semibold text-gray-700 px-2">Total Room Revenue:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalRoomRevenue?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Restaurant Sale:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(data.totalRestaurantSale?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 px-2">Meal Plan Sale:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalMealPlanSale?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Bar Sale:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(data.totalBarSale?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 px-2">Total Expense:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalExpense?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Total CLD:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {data.totalCld ?? "-"}
      </div>
      
       <div className="font-semibold text-gray-700 px-2">
        Total Cash Deposit:
      </div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.totalCashDeposit?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">
        Petty Cash Used:
      </div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(data.totalPettyCash?.toFixed(2))}
      </div>

      <div className="font-semibold text-gray-700 px-2">ARR:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(data.arr?.toFixed(2))}
      </div>
    </div>
  );
};

export default function YearlyViewDisplay() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Defaults: Start from 2 months ago, End at current month
  const [startMonth, setStartMonth] = useState(
    currentMonth - 2 > 0 ? currentMonth - 2 : 1
  );
  const [startYear, setStartYear] = useState(currentYear);
  
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [endYear, setEndYear] = useState(currentYear);

  const [yearlyData, setYearlyData] = useState<RangeSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<MonthlyReportItem | null>(null);

  const years = Array.from({ length: 6 }, (_, i) => currentYear - 1 + i);

  const fetchYearlyData = async () => {
    setLoading(true);
    try {
      // Constructing Query Params based on your provided URL structure
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/custom-range-summary`,
        {
          params: {
            startYear,
            startMonth,
            endYear,
            endMonth,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setYearlyData(response.data);
    } catch (error: any) {
      console.error("Error fetching range summary", error);
      setYearlyData(null);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    fetchYearlyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMonth, startYear, endMonth, endYear]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMonthDetail(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="bg-white p-1 rounded shadow space-y-1">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-2 rounded border">
        <div className="flex items-center gap-2 w-full">
            <span className="text-xs font-bold text-gray-500 uppercase w-10">From:</span>
            <select
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-gray-800"
            value={startMonth}
            onChange={(e) => setStartMonth(parseInt(e.target.value))}
            >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                {getMonthName(m)}
                </option>
            ))}
            </select>
            <select
            className="w-24 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-gray-800"
            value={startYear}
            onChange={(e) => setStartYear(parseInt(e.target.value))}
            >
            {years.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
            </select>
        </div>

        <div className="hidden md:block text-gray-400">→</div>

        <div className="flex items-center gap-2 w-full">
             <span className="text-xs font-bold text-gray-500 uppercase w-10">To:</span>
            <select
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-gray-800"
            value={endMonth}
            onChange={(e) => setEndMonth(parseInt(e.target.value))}
            >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                {getMonthName(m)}
                </option>
            ))}
            </select>
            <select
            className="w-24 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:ring-2 focus:ring-gray-800"
            value={endYear}
            onChange={(e) => setEndYear(parseInt(e.target.value))}
            >
            {years.map((y) => (
                <option key={y} value={y}>{y}</option>
            ))}
            </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-300 rounded py-1">
        {loading ? (
          <div className="p-4 text-center text-gray-600 font-medium">Loading Range Summary...</div>
        ) : yearlyData ? (
          <div className="space-y-2">
            
            {/* 1. Combined Summary Section */}
            <div className="px-1">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-t">
                    COMBINED SUMMARY ({yearlyData.combinedSummary.monthsFound} Months)
                </div>
                <SummaryGrid data={yearlyData.combinedSummary} />
            </div>

            {/* 2. Monthly List Section */}
            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-450px)] custom-scrollbar border px-2 py-1 rounded-lg bg-gray-100 mx-1">
                {yearlyData.monthlyReports.length > 0 ? (
                    yearlyData.monthlyReports.map((report) => (
                        <div
                            key={report._id}
                            className="bg-white border border-gray-200 px-4 py-1 rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition shadow-sm group"
                            onClick={() => setSelectedMonthDetail(report)}
                        >
                            <div className="flex justify-between items-center mb-0">
                                <span className="font-bold text-lg text-gray-800 group-hover:text-blue-700">
                                    {getMonthName(report.month)} {report.year}
                                </span>
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    Occ: {report.avgOccupancy.toFixed(1)}%
                                </span>
                            </div>

                            <div >
                                 <span className=" text-gray-900">Revenue: {formatMoney(report.totalMonthRevenue.toFixed(2))}</span>
                               
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No monthly records found for this range.
                    </div>
                )}
            </div>

          </div>
        ) : (
            <div className="p-4 text-center text-gray-600">No Data Available</div>
        )}
      </div>

      {/* Modal for Monthly Details */}
      {selectedMonthDetail && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setSelectedMonthDetail(null)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full shadow-2xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">
                {getMonthName(selectedMonthDetail.month)} {selectedMonthDetail.year} Details
                </h2>
                <button 
                    onClick={() => setSelectedMonthDetail(null)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <SummaryGrid data={selectedMonthDetail} />
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                onClick={() => setSelectedMonthDetail(null)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the type for MonthlySummary
interface MonthlySummary {
  month: number;
  year: number;
  totalRoomSold: number;
  avgRoomPerDay: number;
  avgOccupancy: number;
  totalRoomRevenue: number;
  arr: number;
  revPerRoom: number;
  totalRestaurantSale: number;
  totalMealPlanSale: number;
  totalBarSale: number;
  totalCld: number;
  totalCake: number;
  totalExpense: number;
  totalCashDeposit: number;
  totalPettyCash: number;
  totalMonthRevenue: number;
}

// Define the type for the report data to improve type safety
interface DailyReport {
  date: string;
  day: number;
  month: number;
  year: number;
  roomSold: number;
  occupancyPercentage: number;
  totalAdultPax: number;
  totalChildPax: number;
  roomRevenue: number;
  arr: number;
  revPerRoom: number;
  expectedArrival: number;
  stayOver: number;
  noShow: number;
  restaurantSale: number;
  mealPlanPax: number;
  mealPlanSale: number;
  barSale: number;
  roomsUpgraded: number;
  roomHalfDay: number;
  cld: number;
  cake: number;
  tableDecoration: number;
  expense: number;
  cashDeposit: number;
  pettyCash: number;
  totalRevenue: number;
}

// Helper to get month name from number
const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleDateString("en-US", { month: "long" });
};

export default function MonthlyViewDisplay() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlySummary, setMonthlySummary] = useState<
    MonthlySummary | undefined
  >();
  const [dailyReportsInMonth, setDailyReportsInMonth] = useState<DailyReport[]>(
    []
  );
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingDailyReports, setLoadingDailyReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(
    null
  );

  const fetchMonthlyData = async () => {
    setLoadingSummary(true);
    setLoadingDailyReports(true);
    try {
      const summaryResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/admin/month-summary/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMonthlySummary(summaryResponse.data);
    } catch (error: any) {
      setMonthlySummary(undefined);
      if (error.response?.status === 404) {
        alert("Monthly summary not found for the selected period.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error fetching monthly summary", error);
        alert("An error occurred while fetching monthly summary");
      }
    } finally {
      setLoadingSummary(false);
    }

    try {
      const dailyReportsResponse = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/admin/month-daily-reports/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const sortedReports = dailyReportsResponse.data.sort(
        (a: DailyReport, b: DailyReport) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDailyReportsInMonth(sortedReports);
    } catch (error: any) {
      setDailyReportsInMonth([]);
      if (error.response?.status === 404) {
        console.log("No daily reports found for the selected month.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error("Error fetching daily reports for month", error);
        alert("An error occurred while fetching daily reports for the month");
      }
    } finally {
      setLoadingDailyReports(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReport(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleUpdateClick = () => {
    fetchMonthlyData();
  };

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const closeModal = () => setSelectedReport(null);

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="flex gap-2 items-center">
        <select
          className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((monthNum) => (
            <option key={monthNum} value={monthNum}>
              {getMonthName(monthNum).toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-md font-semibold text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          onClick={handleUpdateClick}
          disabled={loadingSummary || loadingDailyReports}
        >
          {loadingSummary || loadingDailyReports ? "Updating..." : "Update"}
        </button>
      </div>

      <div className="bg-gray-300 p-3 rounded text-center text-sm md:text-lg font-semibold text-gray-800">
        {loadingSummary ? (
          "Loading Monthly Summary..."
        ) : monthlySummary ? (
          <>
            <span className="font-bold">
              MONTH SUMMARY ({getMonthName(monthlySummary.month).toUpperCase()}{" "}
            </span>
            {monthlySummary.year})
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-base mt-2">
              <div>
                Total Revenue: ₹
                {monthlySummary.totalMonthRevenue?.toFixed(2) ?? "-"}
              </div>
              <div>Room Sold: {monthlySummary.totalRoomSold ?? "-"}</div>
              <div>
                Avg Occupancy: {monthlySummary.avgOccupancy?.toFixed(2) ?? "-"}%
              </div>
              <div>
                Total Room Revenue: ₹
                {monthlySummary.totalRoomRevenue?.toFixed(2) ?? "-"}
              </div>
              <div>
                Restaurant Sale: ₹
                {monthlySummary.totalRestaurantSale?.toFixed(2) ?? "-"}
              </div>
              <div>
                Meal Plan Sale: ₹
                {monthlySummary.totalMealPlanSale?.toFixed(2) ?? "-"}
              </div>
              <div>
                Bar Sale: ₹{monthlySummary.totalBarSale?.toFixed(2) ?? "-"}
              </div>
              <div>
                Total Expense: ₹{monthlySummary.totalExpense?.toFixed(2) ?? "-"}
              </div>
              <div>Total CLD: {monthlySummary.totalCld ?? "-"}</div>
              <div>Total Cake: {monthlySummary.totalCake ?? "-"}</div>
            </div>
          </>
        ) : (
          "No Monthly Summary Available"
        )}
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-350px)] custom-scrollbar border p-2 rounded-lg bg-gray-100">
        {loadingDailyReports ? (
          <div className="text-center text-gray-500">
            Loading daily reports...
          </div>
        ) : dailyReportsInMonth.length > 0 ? (
          dailyReportsInMonth.map((report) => (
            <div
              key={report.date}
              className="bg-gray-300 p-3 rounded cursor-pointer hover:bg-gray-400 transition"
              onClick={() => setSelectedReport(report)}
            >
            
              <span className="font-semibold text-gray-800">
                {new Date(report.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  timeZone: "UTC",
                })}
              </span>

              <p className="text-base text-gray-600">
                Revenue: ₹{report.totalRevenue?.toFixed(2) ?? "-"} | Rooms:{" "}
                {report.roomSold ?? "-"}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No daily records for this month.
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">
              Details for{" "}
              {new Date(selectedReport.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </h2>
            <ul className="space-y-1 text-sm max-h-[60vh] overflow-y-auto">
              <li>Room Sold: {selectedReport.roomSold}</li>
              <li>Occupancy: {selectedReport.occupancyPercentage}%</li>
              <li>Room Revenue: ₹{selectedReport.roomRevenue}</li>
              <li>ARR: ₹{selectedReport.arr}</li>
              <li>RevPAR: {selectedReport.revPerRoom}</li>
              <li>Expected Arrivals: {selectedReport.expectedArrival}</li>
              <li>Stay Over: {selectedReport.stayOver}</li>
              <li>No Show: {selectedReport.noShow}</li>
              <li>Restaurant Sale: ₹{selectedReport.restaurantSale}</li>
              <li>Bar Sale: ₹{selectedReport.barSale}</li>

              <li>
                Meal Plan Sale: ₹{selectedReport.mealPlanSale}-
                {selectedReport.mealPlanPax}Pax
              </li>
              <li>CLD: {selectedReport.cld}</li>
              <li>Cake: {selectedReport.cake}</li>
              <li>Table Decoration: {selectedReport.tableDecoration}</li>
              <li>Expense: ₹ -{selectedReport.expense}</li>
              <li>Cash Deposit: ₹{selectedReport.cashDeposit}</li>
              <li>Petty Cash Balance: ₹ {selectedReport.pettyCash}</li>

              <li className="font-bold">
                Total Revenue: ₹{selectedReport.totalRevenue.toFixed(2)}
              </li>
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

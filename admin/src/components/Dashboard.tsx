import { useState, useEffect } from "react";
import axios from "axios";
import React from "react"; // Ensure React is imported if using JSX

// Define the type for the report data to improve type safety
interface DailyReport {
  date: string;
  day: number; // Added day, month, year from schema
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
  expectedDeparture: number;
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

function DailyReportDisplay({ report }: { report: DailyReport | undefined }) {
  const formattedDate =
  report?.date &&
  new Date(report.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata", // Force IST timezone
  }).toUpperCase();
      // console.log(report?.date );
      // console.log(formattedDate);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-center font-semibold text-lg md:text-2xl mb-4">
        {formattedDate ?? "Loading..."}
      </h2>
      <div className="max-h-[calc(100vh-250px)] bg-gray-100 rounded-lg border p-2 text-lg space-y-2 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Room Sold</span>
          <span>{report?.roomSold ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Occupancy</span>
          <span>{report?.occupancyPercentage ?? "-"} %</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Total Pax</span>
          <span>
            {report?.totalAdultPax ?? 0} adult {report?.totalChildPax ?? 0}{" "}
            child
          </span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Room Revenue</span>
          <span>₹{report?.roomRevenue ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">ARR</span>
          <span>{report?.arr ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">RevPAR</span>
          <span>{report?.revPerRoom ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Expected Arrival</span>
          <span>{report?.expectedArrival ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Expected Departure</span>
          <span>{report?.expectedDeparture ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Stay over</span>
          <span>{report?.stayOver ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">No Show</span>
          <span>{report?.noShow ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Restaurant Sale</span>
          <span>₹{report?.restaurantSale ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Meal Plan Pax</span>
          <span>{report?.mealPlanPax ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Meal Plan Sale</span>
          <span>₹{report?.mealPlanSale ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Bar Sale</span>
          <span>₹{report?.barSale ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Rooms Upgraded</span>
          <span>{report?.roomsUpgraded ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Room Half day</span>
          <span>{report?.roomHalfDay ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Candle Light Dinner</span>
          <span>{report?.cld ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Cake</span>
          <span>{report?.cake ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Table Decoration</span>
          <span>{report?.tableDecoration ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Expense</span>
          <span>- ₹{report?.expense ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Cash deposit</span>
          <span>₹{report?.cashDeposit ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-semibold">Petty Cash</span>
          <span>₹{report?.pettyCash ?? "-"}</span>
        </div>
        <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
          <span className="font-bold">Total Revenue</span>
          <span className="font-bold">₹{report?.totalRevenue ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}

// Helper to get month name from number
const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Month is 0-indexed in JS Date
  return date.toLocaleDateString("en-US", { month: "long" });
};

// New component for Monthly View
function MonthlyViewDisplay() {
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlySummary, setMonthlySummary] = useState<
    MonthlySummary | undefined
  >();
  const [dailyReportsInMonth, setDailyReportsInMonth] = useState<
    DailyReport[]
  >([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingDailyReports, setLoadingDailyReports] = useState(false);

  const fetchMonthlyData = async () => {
    setLoadingSummary(true);
    setLoadingDailyReports(true);
    try {
      // Fetch Monthly Summary
      const summaryResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/month-summary/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMonthlySummary(summaryResponse.data);
    } catch (error: any) {
      setMonthlySummary(undefined); // Clear previous summary
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
      // Fetch Daily Reports for the month
      // Assuming you have a route like /admin/daily-reports/:year/:month
      const dailyReportsResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/month-daily-reports/${selectedYear}/${selectedMonth}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Sort reports by date in descending order (latest date first)
      const sortedReports = dailyReportsResponse.data.sort(
        (a: DailyReport, b: DailyReport) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDailyReportsInMonth(sortedReports);
    } catch (error: any) {
      setDailyReportsInMonth([]); // Clear previous daily reports
      if (error.response?.status === 404) {
        // No daily reports found is common, don't alert unless it's a real error
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
    // Fetch data on initial render for the current month/year
    fetchMonthlyData();
  }, []); // Empty dependency array means it runs once on mount

  const handleUpdateClick = () => {
    fetchMonthlyData(); // Re-fetch when Update button is clicked
  };

  // Generate years for select dropdown (e.g., current year - 5 to current year + 5)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      {/* Month and Year Selectors */}
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
          disabled={loadingSummary || loadingDailyReports} // Disable while fetching
        >
          {loadingSummary || loadingDailyReports ? "Updating..." : "Update"}
        </button>
      </div>

      {/* Whole Month Summary */}
      <div className="bg-gray-300 p-3 rounded text-center text-sm md:text-lg font-semibold text-gray-800">
        {loadingSummary ? (
          "Loading Monthly Summary..."
        ) : monthlySummary ? (
          <>
            <span className="font-bold">MONTH SUMMARY ({getMonthName(monthlySummary.month).toUpperCase()}{" "}</span>
            {monthlySummary.year})
            <p className="text-xs mt-1 md:text-base ">
              Total Revenue: ₹{monthlySummary.totalMonthRevenue?.toFixed(2) ?? "-"} | Room Sold:{" "}
              {monthlySummary.totalRoomSold ?? "-"} | Avg Occupancy:{" "}
              {monthlySummary.avgOccupancy?.toFixed(2) ?? "-"}%
              {/* Add more key summary points here */}
            </p>
          </>
        ) : (
          "No Monthly Summary Available"
        )}
      </div>

      {/* Daily Records for the month */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-350px)] custom-scrollbar border p-2 rounded-lg bg-gray-100">
        {loadingDailyReports ? (
          <div className="text-center text-gray-500">
            Loading daily reports...
          </div>
        ) : dailyReportsInMonth.length > 0 ? (
          dailyReportsInMonth.map((report) => (
            <div key={report.date} className="bg-gray-300 p-3 rounded">
              <span className="font-semibold text-gray-800">
                {new Date(report.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
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
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"day" | "month">("day");
  const [isMobile, setIsMobile] = useState(false);
  const [todayReport, setTodayReport] = useState<DailyReport | undefined>();

  const fetchTodaysReport = async () => {
    try {
      const response = await axios.get(
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
    fetchTodaysReport();

    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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
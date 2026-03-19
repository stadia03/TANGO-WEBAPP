import React, { useEffect, useState } from "react";
import api from "../axiosConfig"; 
import formatMoney from "../utils/formatMoney"; 
import { MonthlyReportItem, RangeSummaryData } from "../types/DailyReport";

const getMonthName = (monthNumber: number) => {
  const date = new Date(2020, monthNumber - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long" });
};

// Reusable Summary Grid with safety checks
const SummaryGrid = ({ data }: { data: any }) => {
  if (!data) return null;

  // Helper to safely format numbers that might be undefined
  const safeFix = (num: any) => (num !== undefined && num !== null ? Number(num).toFixed(2) : "0.00");

  return (
    <div className="grid grid-cols-2 gap-y-1 text-sm md:text-base border p-2 rounded bg-white">
      <div className="font-semibold text-gray-700 px-2">Total Revenue:</div>
      <div className="text-gray-900 text-right px-2 font-bold">
        {formatMoney(safeFix(data.totalMonthRevenue))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">UPI Deposit:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(safeFix(data.totalUpiDeposit))}
      </div>

      <div className="font-semibold text-gray-700 px-2">Cash Received:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(safeFix(data.totalCashReceived))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">Room Sold:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {data.totalRoomSold ?? 0}
      </div>

      <div className="font-semibold text-gray-700 px-2">Total Pax:</div>
      <div className="text-gray-900 text-right px-2">
        {data.totalAdult ?? 0} A, {data.totalChild ?? 0} C
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">Avg Occupancy:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {data.avgOccupancy ? Number(data.avgOccupancy).toFixed(2) : "0.00"}%
      </div>

      <div className="font-semibold text-gray-700 px-2">Room Revenue:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(safeFix(data.totalRoomRevenue))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">Restaurant Sale:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(safeFix(data.totalRestaurantSale))}
      </div>

      <div className="font-semibold text-gray-700 px-2">Spa Sale:</div>
      <div className="text-gray-900 text-right px-2">
        {formatMoney(safeFix(data.totalSpa))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2">Meal Plan Sale:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2">
        {formatMoney(safeFix(data.totalMealPlanSale))}
      </div>

       <div className="font-semibold text-gray-700  px-2">Total Expense:</div>
      <div className="text-gray-900  text-right px-2 ">
        {formatMoney(safeFix(data.totalExpense))}
      </div>

      <div className="font-semibold text-gray-700 bg-slate-100 px-2 font-bold">Cash Deposit:</div>
      <div className="text-gray-900 text-right bg-slate-100 px-2 ">
        {formatMoney(safeFix(data.totalCashDeposit))}
      </div>
    </div>
  );
};

export default function YearlyViewDisplay() {
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [yearlyData, setYearlyData] = useState<RangeSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<MonthlyReportItem | null>(null);

  const fetchYearlyData = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const response = await api.get(`${import.meta.env.VITE_SERVER_URL}/admin/date-range-summary`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setYearlyData(response.data);
    } catch (error: any) {
      console.error("Error fetching range summary", error);
      setYearlyData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyData();
  }, [startDate, endDate]);

  return (
    <div className="bg-white p-1 rounded shadow space-y-1">
      {/* Date Pickers */}
      <div className="flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-2 rounded border">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs font-bold text-gray-500 uppercase w-10">From:</span>
          <input type="date" className="flex-1 p-2 border rounded text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)}  max={today}/>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs font-bold text-gray-500 uppercase w-10">To:</span>
          <input type="date" className="flex-1 p-2 border rounded text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} max={today} />
        </div>
      </div>

      <div className="bg-gray-300 rounded py-1 min-h-[200px]">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : yearlyData ? (
          <div className="space-y-2">
            <div className="px-1">
              <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-t">COMBINED SUMMARY</div>
              <SummaryGrid data={yearlyData.combinedSummary} />
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[400px] border px-2 py-1 rounded bg-gray-100 mx-1">
              {yearlyData.monthlyReports?.map((report) => (
                <div key={`${report.year}-${report.month}`} className="bg-white border p-2 rounded cursor-pointer hover:bg-blue-50 transition" onClick={() => setSelectedMonthDetail(report)}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{getMonthName(report.month)} {report.year}</span>
                    <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded">Occ: {(report.avgOccupancy || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-600">
                    <span>Revenue: {formatMoney((report.totalMonthRevenue || 0).toFixed(0))}</span>
                    <span>Restaurant: {formatMoney((report.totalRestaurantSale || 0).toFixed(0))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">No Data Found</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMonthDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedMonthDetail(null)}>
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{getMonthName(selectedMonthDetail.month)} {selectedMonthDetail.year}</h2>
            <SummaryGrid data={selectedMonthDetail} />
            <button className="mt-4 w-full py-2 bg-gray-800 text-white rounded" onClick={() => setSelectedMonthDetail(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
// admin/src/components/ExportExcelButton.tsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExportExcelButtonProps {
  monthlySummary: any; // Type accordingly if you have TypeScript interfaces
  dailyReportsInMonth: any[];
  getMonthName: (monthNumber: number) => string;
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  monthlySummary,
  dailyReportsInMonth,
  getMonthName,
}) => {
  const exportToExcel = () => {
    if (!monthlySummary) {
      alert("No monthly summary data available for export.");
      return;
    }

    const monthSummaryData = [
      ["Field", "Value"],
      ["Month", getMonthName(monthlySummary.month).toUpperCase()],
      ["Year", monthlySummary.year],
      ["Total Room Sold", monthlySummary.totalRoomSold],
      ["Average Room Per Day", monthlySummary.avgRoomPerDay.toFixed(2)],
      ["Average Occupancy %", monthlySummary.avgOccupancy.toFixed(2)],
      ["Total Room Revenue", monthlySummary.totalRoomRevenue],
      ["ARR", monthlySummary.arr],
      ["Rev Per Room", monthlySummary.revPerRoom],
      ["Total Restaurant Sale", monthlySummary.totalRestaurantSale],
      ["Total Meal Plan Sale", monthlySummary.totalMealPlanSale],
      ["Total Bar Sale", monthlySummary.totalBarSale],
      ["Total CLD", monthlySummary.totalCld],
      ["Total Cake", monthlySummary.totalCake],
      ["Total Expense", monthlySummary.totalExpense],
      ["Total Cash Deposit", monthlySummary.totalCashDeposit],
      ["Total Petty Cash", monthlySummary.totalPettyCash],
      ["Total UPI Deposit", monthlySummary.totalUpiDeposit],
      ["Total Cash Received", monthlySummary.totalCashReceived],
      ["Total Month Revenue", monthlySummary.totalMonthRevenue],
    ];

    const dailyReportsData = dailyReportsInMonth.length > 0
      ? [
          [
            "Date", "Room Sold", "Occupancy %", "Total Adult Pax", "Total Child Pax",
            "Room Revenue", "ARR", "Rev Per Room", "Expected Arrival", "Stay Over", "No Show",
            "Restaurant Sale", "Meal Plan Pax", "Meal Plan Sale", "Bar Sale", "Rooms Upgraded",
            "Room HalfDay", "CLD", "Cake", "Table Decoration", "Expense", "Cash Deposit", "Petty Cash",
             "UPI Deposit", "Cash Received", "Total Revenue"
          ],
          ...dailyReportsInMonth.map((report) => [
            new Date(report.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year:"numeric",
                  timeZone: "UTC",
                }),
            report.roomSold,
            report.occupancyPercentage,
            report.totalAdultPax,
            report.totalChildPax,
            report.roomRevenue,
            report.arr,
            report.revPerRoom,
            report.expectedArrival,
            report.stayOver,
            report.noShow,
            report.restaurantSale,
            report.mealPlanPax,
            report.mealPlanSale,
            report.barSale,
            report.roomsUpgraded,
            report.roomHalfDay,
            report.cld,
            report.cake,
            report.tableDecoration,
            report.expense,
            report.cashDeposit,
            report.pettyCash,
            report.upiDeposit,
            report.cashReceived,
            report.totalRevenue,
          ]),
        ]
      : [];

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.aoa_to_sheet(monthSummaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Monthly Summary");

    if (dailyReportsData.length > 0) {
      const ws2 = XLSX.utils.aoa_to_sheet(dailyReportsData);
      XLSX.utils.book_append_sheet(wb, ws2, "Daily Reports");
    }

    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const filename = `Monthly_Report_${monthlySummary.year}_${monthlySummary.month}.xlsx`;
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
  };

  return (
    <button
      onClick={exportToExcel}
      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      title="Export monthly data to Excel"
    >
      Export
    </button>
  );
};

export default ExportExcelButton;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DailyReportForm from "../components/DailyReportForm";
import api from '../axiosConfig';
function DailyReport() {
  const [isSubmittedToday, setIsSubmittedToday] = useState<boolean | null>(null);
  const [report, setLatestReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Reusable fetch function to load latest report
  const fetchLatestReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/user/latest-report`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const resReport = res.data;

      setLatestReport(resReport);

      const today = new Date();
      const isToday =
        resReport.day === today.getUTCDate() &&
        resReport.month === today.getUTCMonth() + 1 &&
        resReport.year === today.getUTCFullYear();

      setIsSubmittedToday(isToday);
    } catch (error) {
      console.error("Failed to fetch latest report:", error);
      setIsSubmittedToday(false);
      setLatestReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const generateReportMessage = () => {
    if (!report) return "";

    const reportDate = new Date(report.date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const fields = [
      ["Room Sold", report.roomSold],
      ["Occupancy", `${report.occupancyPercentage}%`],
      ["Total Pax", `${report.totalAdultPax} adult(s), ${report.totalChildPax} child(ren)`],
      ["Room Revenue", `₹${report.roomRevenue}`],
      ["ARR", report.arr],
      ["RevPAR", report.revPerRoom],
      ["Expected Arrival", report.expectedArrival],
      ["Expected Departure", report.expectedDeparture],
      ["Stay Over", report.stayOver],
      ["No Show", report.noShow],
      ["Restaurant Sale", `₹${report.restaurantSale}`],
      ["Meal Plan Pax", report.mealPlanPax],
      ["Meal Plan Sale", `₹${report.mealPlanSale}`],
      ["Bar Sale", `₹${report.barSale}`],
      ["Rooms Upgraded", report.roomsUpgraded],
      ["Room Half Day", report.roomHalfDay],
      ["Candle Light Dinner", report.cld],
      ["Cake", report.cake],
      ["Table Decoration", report.tableDecoration],
      ["Expense", `₹${report.expense}`],
      ["Cash Deposit", `₹${report.cashDeposit}`],
      ["Petty Cash", `₹${report.pettyCash}`],
    ];

    const formattedBody = fields.map(([label, value]) => `• ${label}: ${value}`).join("\n");
    const highlightedRevenue = `\n\n *Total Revenue: ₹${report.totalRevenue}*`;
    const footer = `\n\n_Sent via Tango-WebApp_`;

    return ` *Daily Report - ${reportDate}*\n\n${formattedBody}${highlightedRevenue}${footer}`;
  };

  const sendWhatsappReport = () => {
    const fullMessage = generateReportMessage();
    if (!fullMessage) return;

    const encodedMessage = encodeURIComponent(fullMessage);
    const phoneNumber = "919933292938";
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  const copyToClipboard = async () => {
    const fullMessage = generateReportMessage();
    if (!fullMessage) return;

    try {
      await navigator.clipboard.writeText(fullMessage);
      alert("Report copied to clipboard!");
    } catch (err) {
      alert("Failed to copy to clipboard");
      console.error("Clipboard copy failed:", err);
    }
  };

  // Function to refresh after form submission
  const handleRefreshAfterSubmit = () => {
    // Refetch the latest report to update UI
    fetchLatestReport();
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {loading ? (
        <p className="text-center mt-10 text-gray-600">Loading report...</p>
      ) : isSubmittedToday === null ? (
        <p className="text-center mt-10 text-gray-600">Checking today’s report status...</p>
      ) : isSubmittedToday ? (
        <div className="max-w-2xl mx-auto m-4 p-6 bg-green-100 text-green-700 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">✅ Today's report is already submitted.</h2>
          <div className="max-h-[calc(100vh-300px)] bg-gray-100 rounded-lg border p-2 text-lg space-y-2 overflow-y-auto custom-scrollbar">
            {/* Display report fields */}
            {[
              ["Room Sold", report?.roomSold ?? "-"],
              ["Occupancy", report?.occupancyPercentage ? `${report.occupancyPercentage} %` : "-"],
              ["Total Pax", `${report?.totalAdultPax ?? 0} adult ${report?.totalChildPax ?? 0} child`],
              ["Room Revenue", `₹${report?.roomRevenue ?? "-"}`],
              ["ARR", report?.arr ?? "-"],
              ["RevPAR", report?.revPerRoom ?? "-"],
              ["Expected Arrival", report?.expectedArrival ?? "-"],
              ["Expected Departure", report?.expectedDeparture ?? "-"],
              ["Stay over", report?.stayOver ?? "-"],
              ["No Show", report?.noShow ?? "-"],
              ["Restaurant Sale", `₹${report?.restaurantSale ?? "-"}`],
              ["Meal Plan Pax", report?.mealPlanPax ?? "-"],
              ["Meal Plan Sale", `₹${report?.mealPlanSale ?? "-"}`],
              ["Bar Sale", `₹${report?.barSale ?? "-"}`],
              ["Rooms Upgraded", report?.roomsUpgraded ?? "-"],
              ["Room Half day", report?.roomHalfDay ?? "-"],
              ["Candle Light Dinner", report?.cld ?? "-"],
              ["Cake", report?.cake ?? "-"],
              ["Table Decoration", report?.tableDecoration ?? "-"],
              ["Expense", `- ₹${report?.expense ?? "-"}`],
              ["Cash deposit", `₹${report?.cashDeposit ?? "-"}`],
              ["Petty Cash", `₹${report?.pettyCash ?? "-"}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
                <span className="font-semibold">{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="flex justify-between border p-1 bg-white py-2 px-4 rounded-lg">
              <span className="font-bold">Total Revenue</span>
              <span className="font-bold">₹{report?.totalRevenue ?? "-"}</span>
            </div>
          </div>
          <div className="flex justify-between items-center m-4">
            <button
              onClick={sendWhatsappReport}
              className="py-3 px-6 rounded-md bg-green-200 text-black font-semibold text-lg hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 border-2 border-green-700"
            >
              Send Full Report on Whatsapp
            </button>
            <button
              onClick={copyToClipboard}
              className="py-3 px-6 rounded-md bg-yellow-100 text-black font-semibold text-lg hover:bg-yellow-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-colors duration-200 border-2 border-yellow-600"
            >
              Copy Report to Clipboard
            </button>
          </div>
        </div>
      ) : (
        <DailyReportForm onSubmitSuccess={handleRefreshAfterSubmit} />
      )}
    </div>
  );
}

export default DailyReport;

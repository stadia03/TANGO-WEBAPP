import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DailyReportForm from "../components/DailyReportForm";
import axios from "axios";

function Home() {
  const [isSubmittedToday, setIsSubmittedToday] = useState<boolean | null>(null);
  const [report, setLatestReport] = useState<any>(null);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/latest-report`,
          {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        ); // adjust if your API path differs
        const resReport = res.data;

        setLatestReport(resReport); // optionally use for display

        const today = new Date();
        const isToday =
          resReport.day === today.getDate() +1 &&
          resReport.month === today.getMonth() + 1 &&
          resReport.year === today.getFullYear();

        setIsSubmittedToday(isToday);
      } catch (error) {
        console.error("Failed to fetch latest report:", error);
        setIsSubmittedToday(false); // allow form if error
      }
    };

    fetchLatestReport();
  }, []);

const sendWhatsappReport = () => {
  if (!report) return;

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

  const formattedBody = fields
    .map(([label, value]) => `• ${label}: ${value}`)
    .join("\n");

  const highlightedRevenue = `\n\n *Total Revenue: ₹${report.totalRevenue}*`;
  const footer = `\n\n_Sent via Tango-WebApp_`;

  const fullMessage = ` *Daily Report - ${reportDate}*\n\n${formattedBody}${highlightedRevenue}${footer}`;

  const encodedMessage = encodeURIComponent(fullMessage);
  const phoneNumber = "919933292938"; // change as needed
  const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
};



  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {isSubmittedToday === null ? (
        <p className="text-center mt-10 text-gray-600">Checking today’s report status...</p>
      ) : isSubmittedToday ? (
        <div className="  max-w-2xl mx-auto m-4 p-6 bg-green-100 text-green-700 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">✅ Today's report is already submitted.</h2>
          <div className="max-h-[calc(100vh-300px)] bg-gray-100 rounded-lg border p-2 text-lg space-y-2 overflow-y-auto custom-scrollbar">
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
    <button
    onClick={sendWhatsappReport}
  className="w-full py-3 px-6 mt-4 rounded-md bg-green-200 text-black font-semibold text-lg hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 border-2  border-green-700"
>
  Send Full Report on Whatsapp
</button>
        </div>
      ) : (
        <DailyReportForm />
      )}
    </div>
  );
}

export default Home;

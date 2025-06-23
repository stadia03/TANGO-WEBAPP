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

export default function DailyReportDisplay({ report }: { report: DailyReport | undefined }) {
  const formattedDate =
  report?.date &&
  new Date(report.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
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
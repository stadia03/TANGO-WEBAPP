import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../store";

interface FormData {
  roomSold: number | undefined;
  totalAdultPax: number | undefined;
  totalChildPax: number | undefined;
  expectedArrival: number | undefined;
  stayOver: number | undefined;
  noShow: number | undefined;
  roomRevenue: number | undefined;
  restaurantSale: number | undefined;
  mealPlanSale: number | undefined;
  barSale: number | undefined;
  mealPlanPax: number | undefined;
  roomsUpgraded: number | undefined;
  roomHalfDay: number | undefined;
  cld: number | undefined;
  cake: number | undefined;
  tableDecoration: number | undefined;
  expense: number | undefined;
  cashDeposit: number | undefined;
  pettyCash: number | undefined;
  totalRevenue: number | undefined;
}

interface InputFieldProps {
  label: string;
  name: keyof FormData | string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "number",
  readOnly = false,
  placeholder = "",
  className = "",
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-gray-700 text-sm font-medium">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      required={!readOnly}
      placeholder={placeholder}
      min={type === "number" && name !== "pettyCash" ? 0 : undefined} // ✅ Enforce non-negative numbers except pettyCash
      className={`
        w-full p-2 rounded-md border
        ${
          readOnly
            ? "bg-gray-200 border-gray-300"
            : "bg-white border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
        }
        text-gray-800 text-base
        ${className}
      `}
    />
  </div>
);

const DailyReportForm = () => {
  const [formData, setFormData] = useState<FormData>({
    roomSold: undefined,
    totalAdultPax: undefined,
    totalChildPax: undefined,
    expectedArrival: undefined,
    stayOver: undefined,
    noShow: undefined,
    roomRevenue: undefined,
    restaurantSale: undefined,
    mealPlanSale: undefined,
    barSale: undefined,
    mealPlanPax: undefined,
    roomsUpgraded: undefined,
    roomHalfDay: undefined,
    cld: undefined,
    cake: undefined,
    tableDecoration: undefined,
    expense: undefined,
    cashDeposit: undefined,
    pettyCash: undefined,
    totalRevenue: undefined,
  });

  const [occupancy, updateOccupancy] = useState<number | undefined>();
  const [arr, updateARR] = useState<number | undefined>();
  const [revPar, updateRevPR] = useState<number | undefined>();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDate(); // Call async function inside useEffect
  }, []);

  const fetchDate = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/server-date`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDate(response.data);
    } catch (error) {
      console.error("Failed to fetch server date", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericValue = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      occupancyPercentage: occupancy,
      arr: arr ?? 0,
      revPerRoom: revPar ?? 0,
      submittedBy: localStorage.getItem("userName"),
    };
    console.log(payload);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/daily-report`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Something went wrong while submitting the report.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const calOccupancy = () => {
    const totalRooms = Number(import.meta.env.VITE_TOTAL_ROOMS); // Assuming VITE_ prefix
    const roomSold = Number(
      (document.getElementsByName("roomSold")[0] as HTMLInputElement).value
    );
    if (!isNaN(roomSold) && totalRooms > 0) {
      updateOccupancy(Math.ceil((roomSold * 10000) / totalRooms) / 100);
      calARR();
    } else {
      updateOccupancy(undefined);
    }
  };

  const calARR = () => {
    const roomRev = Number(
      (document.getElementsByName("roomRevenue")[0] as HTMLInputElement).value
    );
    const roomSold = Number(
      (document.getElementsByName("roomSold")[0] as HTMLInputElement).value
    );
    const totalRooms = Number(import.meta.env.VITE_TOTAL_ROOMS);

    if (roomRev > 0 && roomSold > 0) {
      const arrValue = Number((roomRev / roomSold).toFixed(2));
      const revParValue = Number((roomRev / totalRooms).toFixed(2));
      updateARR(arrValue);
      updateRevPR(revParValue);
    } else {
      updateARR(undefined);
      updateRevPR(undefined);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-gray-300 rounded-lg shadow-xl p-6 w-full max-w-4xl flex flex-col gap-6">
        <div className="text-center font-bold text-gray-800 text-lg md:text-xl border-b pb-4">
          {date}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            <InputField
              label="Room sold:"
              name="roomSold"
              value={formData.roomSold}
              onChange={(e) => {
                handleChange(e);
                calOccupancy();
              }}
            />
            <InputField
              label="Occupancy %:"
              name="occupancyPercentage"
              value={occupancy}
              readOnly
            />
            <InputField
              label="Total Adult Pax:"
              name="totalAdultPax"
              value={formData.totalAdultPax}
              onChange={handleChange}
            />
            <InputField
              label="Total Child Pax:"
              name="totalChildPax"
              value={formData.totalChildPax}
              onChange={handleChange}
            />
            <InputField
              label="Stay over:"
              name="stayOver"
              value={formData.stayOver}
              onChange={handleChange}
            />
            <InputField
              label="No Show:"
              name="noShow"
              value={formData.noShow}
              onChange={handleChange}
            />
            <InputField
              label="Room Revenue:"
              name="roomRevenue"
              value={formData.roomRevenue}
              onChange={(e) => {
                handleChange(e);
                calARR();
              }}
            />
            <InputField label="ARR:" name="arr" value={arr} readOnly />
            <InputField
              label="Rev Per Room:"
              name="revPar"
              value={revPar}
              readOnly
            />
            <InputField
              label="Expected Arrival:"
              name="expectedArrival"
              value={formData.expectedArrival}
              onChange={handleChange}
            />

            <InputField
              label="Restaurant Sale:"
              name="restaurantSale"
              value={formData.restaurantSale}
              onChange={handleChange}
            />
            <InputField
              label="Meal Plan Sale:"
              name="mealPlanSale"
              value={formData.mealPlanSale}
              onChange={handleChange}
            />

            <InputField
              label="Meal Plan Pax:"
              name="mealPlanPax"
              value={formData.mealPlanPax}
              onChange={handleChange}
            />
            <InputField
              label="Bar Sale:"
              name="barSale"
              value={formData.barSale}
              onChange={handleChange}
            />
            <InputField
              label="Rooms Upgraded:"
              name="roomsUpgraded"
              value={formData.roomsUpgraded}
              onChange={handleChange}
            />
            <InputField
              label="Room Half Day:"
              name="roomHalfDay"
              value={formData.roomHalfDay}
              onChange={handleChange}
            />
            <InputField
              label="CLD:"
              name="cld"
              value={formData.cld}
              onChange={handleChange}
            />
            <InputField
              label="CAKE:"
              name="cake"
              value={formData.cake}
              onChange={handleChange}
            />
            <InputField
              label="Table Decoration:"
              name="tableDecoration"
              value={formData.tableDecoration}
              onChange={handleChange}
            />
            <InputField
              label="Expense:"
              name="expense"
              value={formData.expense}
              onChange={handleChange}
            />
            <InputField
              label="Cash Deposit:"
              name="cashDeposit"
              value={formData.cashDeposit}
              onChange={handleChange}
            />

            <InputField
              label="Petty Cash Balance:"
              name="pettyCash"
              value={formData.pettyCash}
              onChange={handleChange}
            />
            <InputField
              label="Total Revenue:"
              name="totalRevenue"
              value={formData.totalRevenue}
              onChange={handleChange}
              className="font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <img
                  src="/assets/loading.svg"
                  alt="Loading..."
                  className="w-6 h-6 animate-spin"
                />
              </>
            ) : (
              "SUBMIT REPORT"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyReportForm;

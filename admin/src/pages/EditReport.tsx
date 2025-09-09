// admin/src/pages/EditReport.tsx
import React, { useState, useEffect } from "react";
import api from "../axiosConfig";
import { FormData } from "../types/DailyReport";
import Navbar from "../components/Navbar";

export default function EditReport() {
  // Default to today in yyyy-MM-dd format for <input type="date">
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Auto-calculated fields
  const [occupancy, updateOccupancy] = useState<number | undefined>();
  const [arr, updateARR] = useState<number | undefined>();
  const [revPar, updateRevPR] = useState<number | undefined>();

  const totalRooms = Number(import.meta.env.VITE_TOTAL_ROOMS);

  // ---- Helpers ----
  const parseYMD = (dateStr: string) => {
    // Avoid timezone pitfalls (off-by-one) by parsing the date string directly
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month, day };
  };

  const computeMetrics = (data: Pick<FormData, "roomSold" | "roomRevenue">) => {
    const roomSold = Number(data.roomSold ?? 0);
    const roomRev = Number(data.roomRevenue ?? 0);

    // Occupancy (%) to 2 decimals with ceil as per your original logic
    if (!isNaN(roomSold) && totalRooms > 0 && roomSold >= 0) {
      const occ = roomSold > 0 ? Math.ceil((roomSold * 10000) / totalRooms) / 100 : undefined;
      updateOccupancy(occ);
    } else {
      updateOccupancy(undefined);
    }

    // ARR & RevPAR
    if (roomRev > 0 && roomSold > 0 && totalRooms > 0) {
      const arrValue = Number((roomRev / roomSold).toFixed(2));
      const revParValue = Number((roomRev / totalRooms).toFixed(2));
      updateARR(arrValue);
      updateRevPR(revParValue);
    } else {
      updateARR(undefined);
      updateRevPR(undefined);
    }
  };

  // ---- Fetch report by selected date ----
  const fetchReport = async (dateStr: string) => {
    setLoading(true);
    setMessage(null);

    const { year, month, day } = parseYMD(dateStr);

    try {
      const res = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/report-on/${year}/${month}/${day}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const foundReport = res.data;

      if (!foundReport) {
        setFormData(null);
        setMessage("No report found for the selected date.");
      } else {
        // Set the editable numeric fields
        const next: FormData = {
          roomSold: foundReport.roomSold,
          totalAdultPax: foundReport.totalAdultPax,
          totalChildPax: foundReport.totalChildPax,
          expectedArrival: foundReport.expectedArrival,
          stayOver: foundReport.stayOver,
          noShow: foundReport.noShow,
          roomRevenue: foundReport.roomRevenue,
          restaurantSale: foundReport.restaurantSale,
          mealPlanSale: foundReport.mealPlanSale,
          barSale: foundReport.barSale,
          mealPlanPax: foundReport.mealPlanPax,
          roomsUpgraded: foundReport.roomsUpgraded,
          roomHalfDay: foundReport.roomHalfDay,
          cld: foundReport.cld,
          cake: foundReport.cake,
          tableDecoration: foundReport.tableDecoration,
          expense: foundReport.expense,
          cashDeposit: foundReport.cashDeposit,
          pettyCash: foundReport.pettyCash,
          upiDeposit: foundReport.upiDeposit,
          bankDeposit: foundReport.bankDeposit,
          totalRevenue: foundReport.totalRevenue,
        };

        setFormData(next);

        // Initialize metrics either from backend (if present) or compute from fields
        if (
          typeof foundReport.occupancyPercentage === "number" ||
          typeof foundReport.arr === "number" ||
          typeof foundReport.revPerRoom === "number"
        ) {
          updateOccupancy(foundReport.occupancyPercentage ?? undefined);
          updateARR(foundReport.arr ?? undefined);
          updateRevPR(foundReport.revPerRoom ?? undefined);
        } else {
          computeMetrics(next);
        }

        setMessage(null);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setMessage("Failed to fetch report.");
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  // On mount / date change -> fetch
  useEffect(() => {
    fetchReport(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Recompute metrics whenever roomSold or roomRevenue changes
  useEffect(() => {
    if (formData) {
      computeMetrics({ roomSold: formData.roomSold, roomRevenue: formData.roomRevenue });
    } else {
      updateOccupancy(undefined);
      updateARR(undefined);
      updateRevPR(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.roomSold, formData?.roomRevenue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const valNumber = value === "" ? undefined : Number(value);

    setFormData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [name]: valNumber } as FormData;
      return updated;
    });

    // ❗️Do NOT call compute functions here using old state; useEffect above will run with fresh state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setMessage(null);

    const { year, month, day } = parseYMD(selectedDate);

    try {
      const payload = {
        ...formData,
        occupancyPercentage: occupancy ?? 0,
        arr: arr ?? 0,
        revPerRoom: revPar ?? 0,
        secretPassword,
        submittedBy: localStorage.getItem("userName") || "admin",
      };

      await api.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/edit-report/${year}/${month}/${day}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("Report updated successfully.");
    } catch (error: any) {
      console.error("Error updating report:", error);
      setMessage(
        error.response?.data?.message || "Failed to update report. Wrong password?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="m-4">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Edit Daily Report</h1>

          {/* Date selector */}
          <div className="mb-4">
            <label htmlFor="reportDate" className="block font-medium mb-1">
              Select Date:
            </label>
            <input
              type="date"
              id="reportDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded w-full max-w-xs"
              // max={todayStr}
            />
          </div>

          {loading && <p>Loading...</p>}

          {message && (
            <p className={`my-2 ${formData ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          {formData ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Auto-calculated fields */}
              <div className="col-span-full flex flex-wrap gap-4 mt-2 bg-slate-200 p-2 rounded-sm">
                <div>
                  <label className="font-medium">Occupancy %</label>
                  <input
                    type="number"
                    value={occupancy ?? ""}
                    readOnly
                    className="border rounded px-2 py-1 max-w-xs bg-gray-100"
                  />
                </div>
                <div>
                  <label className="font-medium">ARR</label>
                  <input
                    type="number"
                    value={arr ?? ""}
                    readOnly
                    className="border rounded px-2 py-1 max-w-xs bg-gray-100"
                  />
                </div>
                <div>
                  <label className="font-medium">Rev PAR</label>
                  <input
                    type="number"
                    value={revPar ?? ""}
                    readOnly
                    className="border rounded px-2 py-1 max-w-xs bg-gray-100"
                  />
                </div>
              </div>

              {/* Editable numeric fields */}
              {Object.entries(formData).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <label className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={val ?? ""}
                    min={key !== "pettyCash" ? 0 : undefined}
                    onChange={handleChange}
                    required={key !== "pettyCash"}
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}

              {/* Password */}
              <div className="col-span-full flex flex-col mt-2">
                <label className="font-medium">Secret Password</label>
                <input
                  type="password"
                  value={secretPassword}
                  onChange={(e) => setSecretPassword(e.target.value)}
                  required
                  className="border rounded px-2 py-1 max-w-xs"
                  placeholder="Enter secret password"
                />
              </div>

              <div className="col-span-full mt-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            !loading && <p>No report data available for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}

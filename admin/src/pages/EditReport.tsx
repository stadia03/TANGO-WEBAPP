// admin/src/pages/EditReport.tsx
import React, { useState, useEffect, useRef } from "react";
import api from "../axiosConfig";
import { FormData } from "../types/DailyReport";
import Navbar from "../components/Navbar";

// ─── Field Groups ────────────────────────────────────────────────────────────
const FIELD_GROUPS: { label: string; color: string; fields: (keyof FormData)[] }[] = [
  {
    label: "🛏 Room Statistics",
    color: "blue",
    fields: ["roomSold", "totalAdultPax", "totalChildPax", "expectedArrival", "stayOver", "noShow"],
  },
  {
    label: "💰 Revenue",
    color: "emerald",
    fields: ["roomRevenue", "restaurantSale", "mealPlanSale", "barSale", "spaSale", "totalRevenue"],
  },
  {
    label: "🍽 Extras & Events",
    color: "purple",
    fields: ["mealPlanPax", "roomsUpgraded", "roomHalfDay", "cld", "cake", "tableDecoration"],
  },
  {
    label: "🏦 Finance",
    color: "amber",
    fields: ["cashDeposit", "upiDeposit", "cashReceived", "pettyCash", "expense"],
  },
];

// Fields that are allowed to be 0 or negative (won't show required error at 0)
const OPTIONAL_FIELDS: (keyof FormData)[] = ["pettyCash", "noShow", "roomHalfDay", "roomsUpgraded", "tableDecoration", "cld", "cake"];

const FIELD_LABELS: Partial<Record<keyof FormData, string>> = {
  roomSold: "Rooms Sold",
  totalAdultPax: "Total Adult Pax",
  totalChildPax: "Total Child Pax",
  expectedArrival: "Expected Arrivals",
  stayOver: "Stay Over",
  noShow: "No Show",
  roomRevenue: "Room Revenue (₹)",
  restaurantSale: "Restaurant Sale (₹)",
  mealPlanSale: "Meal Plan Sale (₹)",
  barSale: "Bar Sale (₹)",
  spaSale: "Spa Sale (₹)",
  totalRevenue: "Total Revenue (₹)",
  mealPlanPax: "Meal Plan Pax",
  roomsUpgraded: "Rooms Upgraded",
  roomHalfDay: "Half-Day Rooms",
  cld: "CLD",
  cake: "Cakes",
  tableDecoration: "Table Decorations",
  cashDeposit: "Cash Deposit (₹)",
  upiDeposit: "UPI Deposit (₹)",
  cashReceived: "Cash Received (₹)",
  pettyCash: "Petty Cash (₹)",
  expense: "Expense (₹)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseYMD = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
};

const formatCurrency = (val: number | undefined) =>
  val !== undefined ? `₹${val.toLocaleString("en-IN")}` : "—";

// ─── Component ────────────────────────────────────────────────────────────────
export default function EditReport() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [formData, setFormData]         = useState<FormData | null>(null);
  const [originalData, setOriginalData] = useState<FormData | null>(null); // for dirty tracking
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const [message, setMessage]           = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // New date (optional — move report to a different date)
  const [enableNewDate, setEnableNewDate] = useState(false);
  const [newDate, setNewDate]             = useState<string>("");

  // Confirm dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // Collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Auto-calculated
  const [occupancy, setOccupancy] = useState<number | undefined>();
  const [arr, setArr]             = useState<number | undefined>();
  const [revPar, setRevPar]       = useState<number | undefined>();

  const totalRooms = Number(import.meta.env.VITE_TOTAL_ROOMS);

  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-clear message ──
  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    if (messageTimer.current) clearTimeout(messageTimer.current);
    if (type === "success") {
      messageTimer.current = setTimeout(() => setMessage(null), 5000);
    }
  };

  // ── Compute metrics ──
  const computeMetrics = (data: Pick<FormData, "roomSold" | "roomRevenue">) => {
    const roomSold = Number(data.roomSold ?? 0);
    const roomRev  = Number(data.roomRevenue ?? 0);

    setOccupancy(roomSold > 0 && totalRooms > 0
      ? Math.ceil((roomSold * 10000) / totalRooms) / 100
      : undefined);

    if (roomRev > 0 && roomSold > 0 && totalRooms > 0) {
      setArr(Number((roomRev / roomSold).toFixed(2)));
      setRevPar(Number((roomRev / totalRooms).toFixed(2)));
    } else {
      setArr(undefined);
      setRevPar(undefined);
    }
  };

  // ── Fetch report ──
  const fetchReport = async (dateStr: string) => {
    setLoading(true);
    setMessage(null);
    setFormData(null);
    setOriginalData(null);
    setErrors({});

    const { year, month, day } = parseYMD(dateStr);

    try {
      const res = await api.get(
        `${import.meta.env.VITE_SERVER_URL}/admin/report-on/${year}/${month}/${day}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const r = res.data;
      if (!r) {
        showMessage("No report found for the selected date.", "info");
      } else {
        const next: FormData = {
          roomSold:        r.roomSold        ?? 0,
          totalAdultPax:   r.totalAdultPax   ?? 0,
          totalChildPax:   r.totalChildPax   ?? 0,
          expectedArrival: r.expectedArrival ?? 0,
          stayOver:        r.stayOver        ?? 0,
          noShow:          r.noShow          ?? 0,
          roomRevenue:     r.roomRevenue     ?? 0,
          restaurantSale:  r.restaurantSale  ?? 0,
          mealPlanSale:    r.mealPlanSale    ?? 0,
          barSale:         r.barSale         ?? 0,
          spaSale:         r.spaSale         ?? 0,   // ✅ was hardcoded 0 before
          totalRevenue:    r.totalRevenue    ?? 0,
          mealPlanPax:     r.mealPlanPax     ?? 0,
          roomsUpgraded:   r.roomsUpgraded   ?? 0,
          roomHalfDay:     r.roomHalfDay     ?? 0,
          cld:             r.cld             ?? 0,
          cake:            r.cake            ?? 0,
          tableDecoration: r.tableDecoration ?? 0,
          expense:         r.expense         ?? 0,
          cashDeposit:     r.cashDeposit     ?? 0,
          pettyCash:       r.pettyCash       ?? 0,
          upiDeposit:      r.upiDeposit      ?? 0,
          cashReceived:    r.cashReceived     ?? 0,
        };

        setFormData(next);
        setOriginalData(next); // snapshot for dirty tracking

        // Metrics
        if (typeof r.occupancyPercentage === "number") {
          setOccupancy(r.occupancyPercentage ?? undefined);
          setArr(r.arr ?? undefined);
          setRevPar(r.revPerRoom ?? undefined);
        } else {
          computeMetrics(next);
        }
      }
    } catch {
      showMessage("Failed to fetch report.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(selectedDate); }, [selectedDate]);

  useEffect(() => {
    if (formData) computeMetrics({ roomSold: formData.roomSold, roomRevenue: formData.roomRevenue });
  }, [formData?.roomSold, formData?.roomRevenue]);

  // ── Dirty tracking ──
  const dirtyFields = formData && originalData
    ? (Object.keys(formData) as (keyof FormData)[]).filter(k => formData[k] !== originalData[k])
    : [];

  // ── Handle input change ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormData;

    // Clear error on change
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));

    setFormData(prev => {
      if (!prev) return prev;
      return { ...prev, [key]: value === "" ? undefined : Number(value) } as FormData;
    });
  };

  // ── Validation ──
  const validate = (): boolean => {
    if (!formData) return false;
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      const val = formData[key];
      if (OPTIONAL_FIELDS.includes(key)) return;
      if (val === undefined || val === null || (val as any) === "") {
        newErrors[key] = "This field is required";
      } else if (Number(val) < 0) {
        newErrors[key] = "Cannot be negative";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showMessage("Please fix the highlighted fields before saving.", "error");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    if (!formData) return;
    setShowConfirm(false);
    setSubmitting(true);
    setMessage(null);

    const { year, month, day } = parseYMD(selectedDate);

    const payload: Record<string, any> = {
      ...formData,
      occupancyPercentage: occupancy ?? 0,
      arr: arr ?? 0,
      revPerRoom: revPar ?? 0,
      secretPassword,
      submittedBy: localStorage.getItem("userName") || "admin",
    };

    // New date fields
    if (enableNewDate && newDate) {
      const { year: nY, month: nM, day: nD } = parseYMD(newDate);
      payload.newYear  = nY;
      payload.newMonth = nM;
      payload.newDay   = nD;
    }

    try {
      await api.put(
        `${import.meta.env.VITE_SERVER_URL}/admin/edit-report/${year}/${month}/${day}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      showMessage("✅ Report updated successfully!", "success");

      // If date moved, switch the date picker to the new date
      if (enableNewDate && newDate) {
        setSelectedDate(newDate);
        setEnableNewDate(false);
        setNewDate("");
      } else {
        // Refresh data
        fetchReport(selectedDate);
      }
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || "Failed to update report. Check your password.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle section collapse ──
  const toggleSection = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));

  // ── Color classes per group ──
  const groupColors: Record<string, { header: string; border: string; badge: string }> = {
    blue:    { header: "bg-blue-50 text-blue-800",    border: "border-blue-200",   badge: "bg-blue-100 text-blue-700"    },
    emerald: { header: "bg-emerald-50 text-emerald-800", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
    purple:  { header: "bg-purple-50 text-purple-800", border: "border-purple-200",  badge: "bg-purple-100 text-purpleald-700" },
    amber:   { header: "bg-amber-50 text-amber-800",   border: "border-amber-200",   badge: "bg-amber-100 text-amber-700"   },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Daily Report</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Select a date, make your changes, and save with your secret password.
          </p>
        </div>

        {/* ── Date Selector card ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5">
          <div className="flex flex-wrap gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Report Date (to edit)
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ── Move to new date toggle ── */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableNewDate"
                checked={enableNewDate}
                onChange={e => {
                  setEnableNewDate(e.target.checked);
                  if (!e.target.checked) setNewDate("");
                }}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor="enableNewDate" className="text-sm font-medium text-gray-700 cursor-pointer">
                Move report to a new date
              </label>
            </div>

            {enableNewDate && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="border border-orange-400 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none bg-orange-50"
                />
                {newDate && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Report will be moved from{" "}
                    <strong>{selectedDate}</strong> → <strong>{newDate}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading report...
          </div>
        )}

        {!loading && formData && (
          <form onSubmit={handleSubmit} noValidate>

            {/* ── Auto-calculated metrics banner ── */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 mb-5 text-white">
              <p className="text-xs uppercase tracking-widest opacity-80 mb-3 font-semibold">
                Auto-Calculated Metrics
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Occupancy %", value: occupancy !== undefined ? `${occupancy}%` : "—" },
                  { label: "ARR",         value: occupancy !== undefined ? formatCurrency(arr) : "—" },
                  { label: "RevPAR",      value: occupancy !== undefined ? formatCurrency(revPar) : "—" },
                ].map(m => (
                  <div key={m.label} className="bg-white/10 rounded-lg px-3 py-2">
                    <p className="text-xs opacity-70">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Dirty fields notice ── */}
            {dirtyFields.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-4 text-sm text-yellow-800 flex items-center gap-2">
                ✏️ <strong>{dirtyFields.length} field{dirtyFields.length > 1 ? "s" : ""} changed:</strong>{" "}
                {dirtyFields.map(f => FIELD_LABELS[f] || f).join(", ")}
              </div>
            )}

            {/* ── Field groups ── */}
            {FIELD_GROUPS.map(group => {
              const colors = groupColors[group.color];
              const isCollapsed = collapsed[group.label];
              const groupErrors = group.fields.filter(f => errors[f]);

              return (
                <div
                  key={group.label}
                  className={`rounded-xl border ${colors.border} mb-4 overflow-hidden shadow-sm`}
                >
                  {/* Group header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(group.label)}
                    className={`w-full flex items-center justify-between px-5 py-3 ${colors.header} font-semibold text-sm`}
                  >
                    <span className="flex items-center gap-2">
                      {group.label}
                      {groupErrors.length > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {groupErrors.length} error{groupErrors.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                    <span className="text-lg">{isCollapsed ? "▸" : "▾"}</span>
                  </button>

                  {/* Group fields */}
                  {!isCollapsed && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-white">
                      {group.fields.map(key => {
                        const val = formData[key];
                        const isDirty = originalData && val !== originalData[key];
                        const error = errors[key];
                        const isOptional = OPTIONAL_FIELDS.includes(key);

                        return (
                          <div key={key} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                              {FIELD_LABELS[key] || key}
                              {isOptional && (
                                <span className="text-gray-400 font-normal">(optional)</span>
                              )}
                              {isDirty && (
                                <span className="ml-auto text-orange-500 text-xs">● changed</span>
                              )}
                            </label>
                            <input
                              type="number"
                              name={key}
                              value={val ?? ""}
                              min={isOptional ? undefined : 0}
                              onChange={handleChange}
                              className={`border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                                error
                                  ? "border-red-400 bg-red-50 focus:ring-red-300"
                                  : isDirty
                                  ? "border-orange-400 bg-orange-50 focus:ring-orange-300"
                                  : "border-gray-300 focus:ring-blue-300"
                              }`}
                            />
                            {error && (
                              <p className="text-red-500 text-xs">{error}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
              {/* ── Status message ── */}
        {message && (
          <div
            className={`rounded-lg px-4 py-3 mb-4 text-sm font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {message.type === "success" ? "✅" : message.type === "error" ? "❌" : "ℹ️"}
            {message.text}
          </div>
        )}
        
            {/* ── Password & Submit ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔑 Secret Password
              </label>
              <input
                type="password"
                value={secretPassword}
                onChange={e => setSecretPassword(e.target.value)}
                required
                placeholder="Required to save changes"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
               disabled={submitting || (dirtyFields.length === 0 && !(enableNewDate && newDate))}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg
                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting
  ? "Saving..."
  : dirtyFields.length > 0
  ? `Save Changes (${dirtyFields.length})`
  : enableNewDate && newDate
  ? "Move Report to New Date"   // ← clear label when only date is changing
  : "Save Changes"}
                </button>

                {dirtyFields.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(originalData);
                      setErrors({});
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    Discard Changes
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {!loading && !formData && !message && (
          <p className="text-gray-500 text-center py-12">No report data available for this date.</p>
        )}
      </div>

      {/* ── Confirm Dialog ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Changes</h2>

            {enableNewDate && newDate && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3 text-sm text-orange-800">
                ⚠️ This will <strong>move the report</strong> from{" "}
                <strong>{selectedDate}</strong> to <strong>{newDate}</strong>
              </div>
            )}

            <p className="text-gray-600 text-sm mb-4">
              You're about to update <strong>{dirtyFields.length} field{dirtyFields.length > 1 ? "s" : ""}</strong>:
            </p>

            <ul className="text-sm text-gray-700 mb-5 space-y-1 max-h-40 overflow-y-auto">
              {dirtyFields.map(f => (
                <li key={f} className="flex justify-between">
                  <span className="text-gray-500">{FIELD_LABELS[f] || f}</span>
                  <span>
                    <span className="line-through text-red-400 mr-2">{originalData?.[f] ?? "—"}</span>
                    <span className="text-green-600 font-semibold">{formData?.[f] ?? "—"}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
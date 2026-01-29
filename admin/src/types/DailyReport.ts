export interface DailyReportType {
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
  upiDeposit: number;
  cashReceived: number;
  totalRevenue: number;
}

export interface FormData {
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
  upiDeposit: number | undefined;
  cashReceived: number | undefined;
  totalRevenue: number | undefined;

}

export interface MonthlySummary {
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
  totalUpiDeposit: number;
  totalCashReceived: number;
  totalMonthRevenue: number;
  totalAdult: number;
  totalChild: number;
}

export interface RangeSummaryData {
  combinedSummary: {
    startDate: string;
    endDate: string;
    monthsFound: number;
    totalRoomSold: number;
    totalRoomRevenue: number;
    totalRestaurantSale: number;
    totalMealPlanSale: number;
    totalBarSale: number;
    totalCld: number;
    totalCake: number;
    totalExpense: number;
    totalCashDeposit: number;
    totalPettyCash: number;
    totalMonthRevenue: number;
    totalUpiDeposit: number;
    totalCashReceived: number;
    totalAdult: number;
    totalChild: number;
    arr: number;
    avgOccupancy: number;
    revPerRoom: number;
  };
  monthlyReports: MonthlyReportItem[];
}

export interface MonthlyReportItem {
  _id: string;
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
  totalUpiDeposit: number;
  totalCashReceived: number;
  totalAdult: number;
  totalChild: number;
}

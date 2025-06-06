import express from "express";
import DailyReport from "../models/DailyReport";
import MonthlySummary from "../models/MonthlySummary";

const router = express.Router();

router.get("/server-date", async (req, res) => {
  const date = new Date();
  const formattedDate = `${date.getDate()} ${date
    .toLocaleString("default", { month: "long" })
    .toUpperCase()} ${date.getFullYear()}`;
  res.send(formattedDate).status(200);
});

router.post("/daily-report", async (req, res) => {
  try {
    // const roomSold = req.body.roomSold  ;
    // const occupancyPercentage= req.body.occupancyPercentage  ;
    // const totalPax= req.body.totalPax  ;
    // const expectedArrival= req.body.expectedArrival  ;
    // const stayOver= req.body.stayOver  ;
    // const noShow= req.body.noShow  ;
    // const roomRevenue= req.body.roomRevenue  ;
    // const arr= req.body.arr  ;
    // const revPerRoom= req.body.  ;
    // const expectedDeparture= req.body.  ;
    // const restaurantSale= req.body.  ;
    // const mealPlanSale= req.body.  ;
    // const barSale= req.body.  ;
    // const mealPlanPax= req.body.  ;
    // const roomsUpgraded= req.body.  ;
    // const roomHalfDay= req.body.  ;
    // const cld= req.body.  ;
    // const cake= req.body.  ;
    // const tableDecoration= req.body.  ;
    // const expense= req.body.  ;
    // const cashDeposit= req.body.  ;
    // const pettyCash= req.body.  ;
    // const totalRevenue= req.body.  ;

    // const DATE = new Date();
     const DATE = new Date(2025, 5, 5);

    const day = DATE.getDate();
    const month = DATE.getMonth() + 1;
    const year = DATE.getFullYear();

    const newEntry = new DailyReport({
      date: DATE.toISOString(),
      day,
      month,
      year,
      roomSold: req.body.roomSold,
      occupancyPercentage: req.body.occupancyPercentage,
      totalAdultPax: req.body.totalAdultPax,
      totalChildPax: req.body.totalChildPax,
      expectedArrival: req.body.expectedArrival,
      stayOver: req.body.stayOver,
      noShow: req.body.noShow,
      roomRevenue: req.body.roomRevenue,
      arr: req.body.arr,
      revPerRoom: req.body.revPerRoom,
      expectedDeparture: req.body.expectedDeparture,
      restaurantSale: req.body.restaurantSale,
      mealPlanSale: req.body.mealPlanSale,
      barSale: req.body.barSale,
      mealPlanPax: req.body.mealPlanPax,
      roomsUpgraded: req.body.roomsUpgraded,
      roomHalfDay: req.body.roomHalfDay,
      cld: req.body.cld,
      cake: req.body.cake,
      tableDecoration: req.body.tableDecoration,
      expense: req.body.expense,
      cashDeposit: req.body.cashDeposit,
      pettyCash: req.body.pettyCash,
      totalRevenue: req.body.totalRevenue,
      submittedBy: req.body.submittedBy,
    });
    await newEntry.save();

    const daily = req.body;
    const totalAvailableRooms = Number(process.env.TOTAL_ROOMS );

    // Find existing MonthlySummary
    const existingSummary = await MonthlySummary.findOne({ month, year });

    if (existingSummary) {
      const daysCount = await DailyReport.countDocuments({ month, year });

      const updatedRoomSold = existingSummary.totalRoomSold + daily.roomSold;
      const updatedRoomRevenue =
        existingSummary.totalRoomRevenue + daily.roomRevenue;

      existingSummary.totalRoomSold = updatedRoomSold;
      existingSummary.avgRoomPerDay = updatedRoomSold / daysCount;
      existingSummary.avgOccupancy =
        (updatedRoomSold * 100) / (totalAvailableRooms * daysCount);
      existingSummary.totalRoomRevenue = updatedRoomRevenue;
      existingSummary.arr = updatedRoomRevenue / updatedRoomSold;
      existingSummary.revPerRoom =
        updatedRoomRevenue / (totalAvailableRooms * daysCount);

      existingSummary.totalRestaurantSale += daily.restaurantSale;
      existingSummary.totalMealPlanSale += daily.mealPlanSale;
      existingSummary.totalBarSale += daily.barSale;
      existingSummary.totalCld += daily.cld;
      existingSummary.totalCake += daily.cake;
      existingSummary.totalExpense += daily.expense;
      existingSummary.totalCashDeposit += daily.cashDeposit;
      existingSummary.totalPettyCash += daily.pettyCash;
      existingSummary.totalMonthRevenue += daily.totalRevenue;

      await existingSummary.save();
    } else {
      const initialDayCount = 1;

      const newSummary = new MonthlySummary({
        month,
        year,
        totalRoomSold: daily.roomSold,
        avgRoomPerDay: daily.roomSold / initialDayCount,
        avgOccupancy:
          (daily.roomSold * 100) / (totalAvailableRooms * initialDayCount),
        totalRoomRevenue: daily.roomRevenue,
        arr: daily.roomRevenue / daily.roomSold,
        revPerRoom: daily.roomRevenue / (totalAvailableRooms * initialDayCount),
        totalRestaurantSale: daily.restaurantSale,
        totalMealPlanSale: daily.mealPlanSale,
        totalBarSale: daily.barSale,
        totalCld: daily.cld,
        totalCake: daily.cake,
        totalExpense: daily.expense,
        totalCashDeposit: daily.cashDeposit,
        totalPettyCash: daily.pettyCash,
        totalMonthRevenue: daily.totalRevenue,
      });

      await newSummary.save();
    }

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        details: (error as Error).message,
      });
  }
});

export default router; 
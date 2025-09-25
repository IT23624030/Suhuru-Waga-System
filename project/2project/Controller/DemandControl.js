const Booking = require("../Model/BookingModel");
const Resource = require("../Model/Resources");

// ----------------- Season Helper -----------------
const getSeasonFromDate = (date) => {
  const month = new Date(date).getMonth(); // 0-11
  const day = new Date(date).getDate();

  if (month >= 3 && month <= 7) return "Yala";
  if (month >= 8 || month <= 2) return "Maha";
  if (month === 3) {
    if (month === 2 && day >= 20) return "Festival-Prep (Short-Crops)";
    if (month === 1 || (month === 2 && day <= 15)) return "Festival-Prep (Root-Crops)";
    if (day >= 1 && day <= 20) return "Festival-Peak";
  }
  if ([0, 1, 7, 8].includes(month)) return "Navam/Pre-Maha/Yala";
  return "Normal";
};

// ----------------- Season Factors -----------------
const seasonFactors = {
  Maha: 0.15,
  Yala: 0.1,
  "Navam/Pre-Maha/Yala": 0.05,
  "Festival-Prep (Short-Crops)": 0.1,
  "Festival-Prep (Root-Crops)": 0.1,
  "Festival-Peak": 0.2,
  Normal: 0.05,
};

// ----------------- Forecast Demand -----------------
const forecastDemand = async (resourceId) => {
  try {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const baseDemand = await Booking.countDocuments({
      resourceId,
      status: "Confirmed",
      createdAt: { $gte: lastYear },
    });

    const season = getSeasonFromDate(new Date());
    const seasonFactor = seasonFactors[season] || seasonFactors.Normal;

    return Math.round(baseDemand * (1 + seasonFactor));
  } catch (error) {
    console.error("Error calculating forecast demand:", error);
    return 0;
  }
};

// ----------------- Price Gouging Check -----------------
const checkPriceGouging = async (resourceId, calculatedMaxPrice, baseRate) => {
  const spikeThreshold = 1.3;
  if (calculatedMaxPrice > baseRate * spikeThreshold) {
    console.log(`⚠️ ALERT: Potential price gouging detected for resource ${resourceId}.`);
  }
};

// ----------------- Similar Products Ceiling -----------------
const calculateCeilingBasedOnSimilarProducts = async (resourceCategory, currentResourceId) => {
  try {
    const similarResources = await Resource.find({
      category: resourceCategory,
      _id: { $ne: currentResourceId },
    });

    if (similarResources.length === 0) return null;

    const totalBaseRate = similarResources.reduce(
      (sum, item) => sum + (item.pricing?.baseRate || 0),
      0
    );
    const averageBaseRate = totalBaseRate / similarResources.length;
    return averageBaseRate * 1.2;
  } catch (error) {
    console.error("Error calculating similar product ceiling:", error);
    return null;
  }
};

// ----------------- Unified Demand + Price Ceiling Report -----------------
const demandReport = async (req, res) => {
  try {
    const resources = await Resource.find();
    const report = [];

    for (const resource of resources) {
      const demandCount = await Booking.countDocuments({
        resourceId: resource._id,
        status: { $in: ["Pending", "Confirmed"] },
      });

      const forecastedDemand = await forecastDemand(resource._id);

      const available = resource.availability?.availableUnits || 0;
      const totalUnits = resource.availability?.totalUnits || 0;
      const shortage = Math.max(forecastedDemand - available, 0);
      const shortageStatus = shortage > 0 ? "Shortage" : "Sufficient";
      const shortageRatio = totalUnits > 0 ? Math.min(shortage / totalUnits, 1) : 0;

      const demandFactor = 0.5;
      const season = getSeasonFromDate(new Date());
      const seasonFactor = seasonFactors[season] || 0;
      const baseRate = resource.pricing?.baseRate || 0;

      const demandBasedCeiling =
        baseRate * (1 + shortageRatio * demandFactor + seasonFactor);

      const similarProductCeiling = await calculateCeilingBasedOnSimilarProducts(
        resource.category,
        resource._id
      );

      const finalMaxPriceCeiling = similarProductCeiling
        ? Math.min(demandBasedCeiling, similarProductCeiling)
        : demandBasedCeiling;

      await checkPriceGouging(resource._id, finalMaxPriceCeiling, baseRate);

      report.push({
        resource: resource.name,
        type: resource.category,
        available,
        realTimeDemand: demandCount,
        forecastedDemand,
        shortage,
        season,
        status: shortageStatus,
        baseRate,
        calculatedMaxPriceCeiling: parseFloat(finalMaxPriceCeiling.toFixed(2)),
      });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error generating unified demand report:", error);
    res.status(500).json({ message: "Failed to generate demand report" });
  }
};

// ----------------- Booking History for Charts -----------------
const getBookingHistoryForCharts = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const bookings = await Booking.find({ resourceId, status: "Confirmed" }).sort({ date: 1 });

    // --- Last 12 months labels ---
    const months = [];
    const monthMap = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      months.push(label);
      monthMap[label] = 0;
    }

    // Count bookings per month
    bookings.forEach((booking) => {
      const monthLabel = new Date(booking.date).toLocaleString("default", { month: "short", year: "numeric" });
      if (monthMap[monthLabel] !== undefined) monthMap[monthLabel] += 1;
    });

    // --- Line Chart ---
    const lineChartData = {
      labels: months,
      datasets: [
        {
          label: "Bookings Per Month",
          data: months.map((m) => monthMap[m]),
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.1,
        },
      ],
    };

    // --- Bar Chart: total unit hours per month ---
    const unitHoursMap = {};
    months.forEach((m) => (unitHoursMap[m] = 0));
    bookings.forEach((b) => {
      const monthLabel = new Date(b.date).toLocaleString("default", { month: "short", year: "numeric" });
      if (unitHoursMap[monthLabel] !== undefined) unitHoursMap[monthLabel] += b.durationHours || 0;
    });

    const barChartData = {
      labels: months,
      datasets: [
        {
          label: "Total Duration Booked (hours)",
          data: months.map((m) => unitHoursMap[m]),
          backgroundColor: "#4CAF50",
        },
      ],
    };

    // --- Pie Chart remains seasonal revenue ---
    const seasonalRevenue = Object.keys(seasonFactors).reduce((acc, season) => {
      acc[season] = 0;
      return acc;
    }, {});

    bookings.forEach((b) => {
      const season = getSeasonFromDate(b.date);
      seasonalRevenue[season] += b.totalAmount || 0;
    });

    const pieChartData = {
      labels: Object.keys(seasonalRevenue),
      datasets: [
        {
          data: Object.values(seasonalRevenue),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
            "#9966FF", "#FF9F40", "#E7E9ED"
          ],
        },
      ],
    };

    res.status(200).json({ lineChartData, barChartData, pieChartData });
  } catch (error) {
    console.error("Error generating chart data:", error);
    res.status(500).json({ message: "Failed to generate chart data", error });
  }
};


module.exports = { demandReport, getBookingHistoryForCharts };
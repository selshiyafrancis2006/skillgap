const mongoose = require("mongoose");

const marketTrendSchema = new mongoose.Schema({
  role: String,
  trendingSkills: [String],
  demandScore: Number,   // 0 - 100
  averageSalary: String
});

module.exports = mongoose.model("MarketTrend", marketTrendSchema);
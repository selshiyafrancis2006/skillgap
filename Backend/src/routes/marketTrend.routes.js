const express = require("express");
const router = express.Router();
const marketController = require("../controllers/marketTrend.controller");

router.get("/:resumeId", marketController.getMarketInsights);

module.exports = router;
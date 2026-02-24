const express = require('express');
const router = express.Router();
const { getBenchmarkInsights } = require('../controllers/industryBenchmark.controller');

router.get('/:resumeId/:targetRole', getBenchmarkInsights);

module.exports = router;
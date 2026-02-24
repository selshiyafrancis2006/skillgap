// resumeOptimizer.routes.js
const express = require('express');
const router = express.Router();
const { optimizeResume } = require('../controllers/resumeOptimizer.controller');

router.post('/optimize', optimizeResume);

module.exports = router;
const express = require('express');
const router = express.Router();
const { generateMockInterview } = require('../controllers/mockInterview.controller');

// GET /api/mock-interview/:resumeId
router.get('/:resumeId', generateMockInterview);

module.exports = router;
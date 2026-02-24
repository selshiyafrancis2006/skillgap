const express = require('express');
const router = express.Router();
const { getCareerAdvice } = require('../controllers/chat.controller');

// Correct usage: pass the function itself, not its result
router.post('/', getCareerAdvice);

module.exports = router;
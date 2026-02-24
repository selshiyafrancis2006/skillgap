const express = require('express');
const router = express.Router();
const { generateSkillGraph } = require('../controllers/skillGraph.controller');

router.get('/:resumeId', generateSkillGraph);

module.exports = router;
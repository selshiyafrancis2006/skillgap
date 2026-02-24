const express = require('express');
const router = express.Router();
const {
  getProgress,
  updateSkillProgress
} = require('../controllers/progress.controller');

router.get('/:resumeId', getProgress);
router.post('/:resumeId/skill', updateSkillProgress);

module.exports = router;
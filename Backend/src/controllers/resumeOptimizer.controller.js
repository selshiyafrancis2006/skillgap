// resumeOptimizer.controller.js
const Resume = require('../models/resume');

exports.optimizeResume = async (req, res) => {
  const { resumeId, targetRoleSkills } = req.body;

  try {
    const resume = await Resume.findById(resumeId).lean();
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const userSkills = resume.skills || [];

    const missingSkills = targetRoleSkills.filter(skill => !userSkills.includes(skill));

    const suggestedChanges = missingSkills.map(skill => `Add '${skill}' in skills or projects section`);

    // Dummy scoring: current vs optimized
    const currentScore = Math.round((userSkills.length / targetRoleSkills.length) * 100);
    const optimizedScore = Math.min(currentScore + missingSkills.length * 5, 100);

    res.json({
      resumeId,
      currentScore,
      optimizedScore,
      missingSkills,
      suggestedChanges
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
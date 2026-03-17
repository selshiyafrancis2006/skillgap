const Resume = require('../models/resume');

exports.optimizeResume = async (req, res) => {
  const { resumeId, targetRoleSkills } = req.body;

  try {
    const resume = await Resume.findById(resumeId).lean();
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const userSkills = (resume.skills || []).map(s => s.toLowerCase());
    const targetSkills = (targetRoleSkills || []);
    const targetSkillsLower = targetSkills.map(s => s.toLowerCase());

    // Only count skills that exist in target role stack
    const matchedSkills = targetSkills.filter(s => userSkills.includes(s.toLowerCase()));
    const missingSkills = targetSkills.filter(s => !userSkills.includes(s.toLowerCase()));

    const suggestedChanges = missingSkills.map(skill =>
      `Add '${skill}' in your skills or projects section`
    );

    // Always 0-100% — matched out of target skills only
    const currentScore = targetSkills.length
      ? Math.min(Math.round((matchedSkills.length / targetSkills.length) * 100), 100)
      : 0;

    // Optimized score — if you add all missing skills
    const optimizedScore = Math.min(currentScore + missingSkills.length * 5, 100);

    res.json({
      resumeId,
      currentScore,
      optimizedScore,
      matchedSkills,
      missingSkills,
      suggestedChanges
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Resume = require('../models/resume');
const IndustryBenchmark = require('../models/industryBenchmark');

exports.getBenchmarkInsights = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.params;

    // 1️⃣ Fetch the Resume
    const resume = await Resume.findById(resumeId).lean();
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const userSkills = Array.isArray(resume.skills) ? resume.skills : [];

    // 2️⃣ Fetch Industry Benchmark for the given role
    const benchmark = await IndustryBenchmark.findOne({ role: targetRole }).lean();
    if (!benchmark) {
      return res.status(404).json({ error: "No benchmark data available for this role" });
    }

    const industrySkills = Array.isArray(benchmark.topSkills)
      ? benchmark.topSkills.map(skill => skill.name)
      : [];

    // 3️⃣ Compare skills to calculate gaps
    const matchedSkills = userSkills.filter(skill => industrySkills.includes(skill));
    const missingSkills = industrySkills.filter(skill => !userSkills.includes(skill));

    const gapScore = industrySkills.length
      ? Math.round((matchedSkills.length / industrySkills.length) * 100)
      : 0;

    res.json({
      resumeId,
      targetRole,
      userSkills,
      industrySkills,
      matchedSkills,
      missingSkills,
      gapScore,
      benchmarkExperience: benchmark.experienceYears || 0,
      benchmarkProjects: Array.isArray(benchmark.projects) ? benchmark.projects : []
    });

  } catch (err) {
    console.error("Error fetching benchmark insights:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
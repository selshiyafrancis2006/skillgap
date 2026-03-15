const Resume = require('../models/resume');
const IndustryBenchmark = require('../models/industryBenchmark');

// Fallback benchmark data in case DB collection is empty
const fallbackBenchmarks = {
  "Full Stack Developer": { topSkills: ["React","Node.js","MongoDB","Express","AWS","TypeScript","Docker","PostgreSQL"], experienceYears: 3 },
  "Frontend Developer":   { topSkills: ["React","JavaScript","TypeScript","CSS","HTML","Redux","Tailwind","Next.js"], experienceYears: 2 },
  "Backend Developer":    { topSkills: ["Node.js","Express","MongoDB","PostgreSQL","AWS","Docker","Redis","REST APIs"], experienceYears: 3 },
  "Data Scientist":       { topSkills: ["Python","Pandas","NumPy","scikit-learn","TensorFlow","SQL","Matplotlib","Jupyter"], experienceYears: 3 },
  "AI Engineer":          { topSkills: ["Python","TensorFlow","PyTorch","NLP","Docker","AWS","FastAPI","MLflow"], experienceYears: 4 },
  "DevOps Engineer":      { topSkills: ["Docker","Kubernetes","AWS","Jenkins","Terraform","Linux","CI/CD","Ansible"], experienceYears: 3 },
  "Mobile Developer":     { topSkills: ["React Native","Flutter","Swift","Kotlin","Firebase","REST APIs","Redux","Xcode"], experienceYears: 2 },
  "Cloud Engineer":       { topSkills: ["AWS","Azure","GCP","Terraform","Kubernetes","Docker","Linux","Networking"], experienceYears: 3 },
  "Cybersecurity Engineer": { topSkills: ["Linux","Networking","Wireshark","Metasploit","Python","Firewalls","SIEM","Cryptography"], experienceYears: 4 },
};

exports.getBenchmarkInsights = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.params;

    const resume = await Resume.findById(resumeId).lean();
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const userSkills = Array.isArray(resume.skills) ? resume.skills : [];

    // Try DB first, fall back to hardcoded
    let benchmark = await IndustryBenchmark.findOne({ role: targetRole }).lean();
    
    let industrySkills;
    let benchmarkExperience = 0;
    let benchmarkProjects = [];

    if (benchmark) {
      industrySkills = Array.isArray(benchmark.topSkills)
        ? benchmark.topSkills.map(skill => typeof skill === 'object' ? skill.name : skill)
        : [];
      benchmarkExperience = benchmark.experienceYears || 0;
      benchmarkProjects = Array.isArray(benchmark.projects) ? benchmark.projects : [];
    } else {
      // Use fallback
      const fallback = fallbackBenchmarks[targetRole] || fallbackBenchmarks["Full Stack Developer"];
      industrySkills = fallback.topSkills;
      benchmarkExperience = fallback.experienceYears;
    }

    // Normalize for case-insensitive comparison
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const matchedSkills = industrySkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
    const missingSkills = industrySkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));

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
      benchmarkExperience,
      benchmarkProjects
    });

  } catch (err) {
    console.error("Error fetching benchmark insights:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const SkillGraph = require('../models/skillGraph');
const Resume = require('../models/resume');

const roleSkillsMap = {
    "Backend Developer":      ["Node.js", "MongoDB", "Java", "AWS", "Express"],
    "Frontend Developer":     ["React", "JavaScript", "CSS", "HTML", "Tailwind"],
    "Full Stack Developer":   ["React", "Node.js", "MongoDB", "Express", "AWS"],
    "Data Scientist":         ["Python", "Pandas", "NumPy", "scikit-learn", "SQL"],
    "AI Engineer":            ["Python", "TensorFlow", "PyTorch", "Docker", "AWS"],
    "DevOps Engineer":        ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
    "Mobile Developer":       ["React Native", "Flutter", "Firebase", "Swift", "Kotlin"],
    "Cloud Engineer":         ["AWS", "Azure", "GCP", "Terraform", "Kubernetes"],
    "Cybersecurity Engineer": ["Linux", "Networking", "Python", "Wireshark", "Metasploit"],
};

exports.generateSkillGraph = async (req, res) => {
    const { resumeId } = req.params;

    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ error: "Resume not found" });

        // Fix: read from both possible field names
        const detectedSkills = resume.skills || resume.skillsDetected || [];
        const detectedLower = detectedSkills.map(s => s.toLowerCase());

        const targetRole = resume.targetRole || "Backend Developer";
        const roleSkills = roleSkillsMap[targetRole] || roleSkillsMap["Backend Developer"];

        const skills = roleSkills.map(skill => {
            const hasSkill = detectedLower.includes(skill.toLowerCase());
            const currentLevel = hasSkill ? 75 : 25;
            const requiredLevel = 90;
            return { name: skill, currentLevel, requiredLevel, gap: requiredLevel - currentLevel };
        });

        const missingSkills = roleSkills.filter(
            skill => !detectedLower.includes(skill.toLowerCase())
        );

        const roadmap = missingSkills.map((skill, index) => ({
            week: index + 1,
            topic: skill,
            project: `Build a mini project using ${skill}`
        }));

        const skillGraph = await SkillGraph.findOneAndUpdate(
            { resumeId },
            { resumeId, targetRole, skills, missingSkills, roadmap },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Skill graph generated successfully",
            data: skillGraph
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
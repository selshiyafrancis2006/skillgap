const SkillGraph = require('../models/skillGraph');
const Resume = require('../models/resume');

// Role-based skill mapping
const roleSkillsMap = {
    "Backend Developer": ["Node.js", "MongoDB", "Java", "AWS", "Express"],
    "Frontend Developer": ["React", "JavaScript", "CSS", "HTML", "Tailwind"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express", "AWS"]
};

exports.generateSkillGraph = async (req, res) => {
    const { resumeId } = req.params;

    try {
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        const detectedSkills = resume.skillsDetected || [];
        const targetRole = resume.targetRole || "Backend Developer";

        const roleSkills = roleSkillsMap[targetRole] || [];

        const skills = roleSkills.map(skill => {
            const hasSkill = detectedSkills.includes(skill);

            const currentLevel = hasSkill ? 75 : 25; // deterministic scoring
            const requiredLevel = 90;
            const gap = requiredLevel - currentLevel;

            return {
                name: skill,
                currentLevel,
                requiredLevel,
                gap
            };
        });

        const missingSkills = roleSkills.filter(
            skill => !detectedSkills.includes(skill)
        );

        const roadmap = missingSkills.map((skill, index) => ({
            week: index + 1,
            topic: skill,
            project: `Build a mini project using ${skill}`
        }));

        const skillGraph = await SkillGraph.findOneAndUpdate(
            { resumeId },
            {
                resumeId,
                targetRole,
                skills,
                missingSkills,
                roadmap
            },
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
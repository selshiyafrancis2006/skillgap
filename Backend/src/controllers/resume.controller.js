const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Resume = require('../models/resume');
const { extractSkills } = require('../utils/skillExtractor');
const { scoreResume } = require('../utils/resumeScorer');
const { generateRoadmap } = require('../utils/roadmapGenerator');
const { detectExperienceLevel, assessProjects, findMissingCoreSkills } = require('../utils/resumeAnalysis');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage }).single('resume');

exports.uploadResume = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        try {
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);

            // --- AI Skill Extraction ---
            const skillsDetected = extractSkills(pdfData.text);

            // Target role example
            const targetSkills = ['JavaScript', 'Node.js', 'React', 'MongoDB', 'AWS', 'System Design'];
            const resumeScore = scoreResume(skillsDetected, targetSkills);

            // New AI analyses
            const experienceLevel = detectExperienceLevel(pdfData.text);
            const projectInsights = assessProjects(pdfData.text);
            const missingCoreSkills = findMissingCoreSkills(skillsDetected, targetSkills);

            const resumeDoc = await Resume.create({
                filename: req.file.filename,
                originalname: req.file.originalname,
                extractedText: pdfData.text,
                skills: skillsDetected,
                experienceLevel,
                projectInsights,
                missingCoreSkills
            });

            // Generate personalized roadmap
            const roadmap = generateRoadmap(skillsDetected, missingCoreSkills);

            return res.json({
                message: "Resume uploaded, saved, and analyzed successfully",
                resume: resumeDoc,
                skillsDetected,
                resumeScore,
                experienceLevel,
                projectInsights,
                missingCoreSkills,
                roadmap
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
};
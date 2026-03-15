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

// ── Detect target role from resume text ──────────────────────────────────────
const detectTargetRole = (text, skills) => {
    const t = text.toLowerCase();
    const s = (skills || []).map(x => x.toLowerCase());

    // Check explicit mentions in resume text first
    if (t.includes('full stack') || t.includes('fullstack') || t.includes('mern') || t.includes('full-stack')) {
        return 'Full Stack Developer';
    }
    if (t.includes('frontend developer') || t.includes('front-end developer') || t.includes('ui developer')) {
        return 'Frontend Developer';
    }
    if (t.includes('backend developer') || t.includes('back-end developer') || t.includes('server-side')) {
        return 'Backend Developer';
    }
    if (t.includes('data scientist') || t.includes('machine learning') || t.includes('ml engineer')) {
        return 'Data Scientist';
    }
    if (t.includes('ai engineer') || t.includes('artificial intelligence') || t.includes('deep learning')) {
        return 'AI Engineer';
    }
    if (t.includes('devops') || t.includes('dev ops') || t.includes('site reliability')) {
        return 'DevOps Engineer';
    }
    if (t.includes('mobile developer') || t.includes('android developer') || t.includes('ios developer')) {
        return 'Mobile Developer';
    }
    if (t.includes('cloud engineer') || t.includes('cloud architect')) {
        return 'Cloud Engineer';
    }
    if (t.includes('cybersecurity') || t.includes('security engineer') || t.includes('penetration')) {
        return 'Cybersecurity Engineer';
    }
    if (t.includes('ui/ux') || t.includes('ux designer') || t.includes('ui designer')) {
        return 'UI/UX Designer';
    }

    // Fallback: infer from skill set
    const frontendSkills = ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'next.js'];
    const backendSkills  = ['node.js', 'express', 'django', 'spring', 'mongodb', 'postgresql', 'redis'];
    const dataSkills     = ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn'];
    const devopsSkills   = ['docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'aws', 'azure'];

    const frontCount  = s.filter(sk => frontendSkills.includes(sk)).length;
    const backCount   = s.filter(sk => backendSkills.includes(sk)).length;
    const dataCount   = s.filter(sk => dataSkills.includes(sk)).length;
    const devopsCount = s.filter(sk => devopsSkills.includes(sk)).length;

    const max = Math.max(frontCount, backCount, dataCount, devopsCount);

    if (max === 0) return 'Full Stack Developer'; // default

    if (max === devopsCount) return 'DevOps Engineer';
    if (max === dataCount)   return 'Data Scientist';
    if (frontCount >= 2 && backCount >= 2) return 'Full Stack Developer';
    if (max === frontCount)  return 'Frontend Developer';
    if (max === backCount)   return 'Backend Developer';

    return 'Full Stack Developer';
};

exports.uploadResume = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        try {
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);

            const skillsDetected = extractSkills(pdfData.text);

            const targetSkills = ['JavaScript', 'Node.js', 'React', 'MongoDB', 'AWS', 'System Design'];

            const rawScore = scoreResume(skillsDetected, targetSkills);
            const resumeScore = typeof rawScore === 'object'
                ? (rawScore?.score ?? rawScore?.total ?? rawScore?.value ?? Object.values(rawScore)[0] ?? 0)
                : Number(rawScore) || 0;

            const experienceLevel   = detectExperienceLevel(pdfData.text);
            const projectInsights   = assessProjects(pdfData.text);
            const missingCoreSkills = findMissingCoreSkills(skillsDetected, targetSkills);

            // ── Auto-detect role from resume text + skills ──
            const targetRole = detectTargetRole(pdfData.text, skillsDetected);

            const resumeDoc = await Resume.create({
                filename:         req.file.filename,
                originalname:     req.file.originalname,
                extractedText:    pdfData.text,
                skills:           skillsDetected,
                skillsDetected:   skillsDetected,
                resumeScore,
                experienceLevel,
                projectInsights,
                missingCoreSkills,
                targetRole,           // ← auto-detected, not hardcoded
            });

            const roadmap = generateRoadmap(skillsDetected, missingCoreSkills);

            return res.json({
                message: "Resume uploaded, saved, and analyzed successfully",
                resume: resumeDoc,
                skillsDetected,
                resumeScore,
                experienceLevel,
                projectInsights,
                missingCoreSkills,
                targetRole,
                roadmap
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
};
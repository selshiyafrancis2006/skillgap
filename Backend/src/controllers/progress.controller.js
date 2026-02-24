const Progress = require('../models/progress');
const SkillGraph = require('../models/skillGraph'); // make sure this exists

// 🟢 Helper: Calculate Overall Readiness Score
const calculateReadiness = async (resumeId, progress) => {
  const skillGraph = await SkillGraph.findOne({ resumeId });

  if (!skillGraph) return 0;

  const requiredSkills = skillGraph.skills;
  if (!requiredSkills || requiredSkills.length === 0) return 0;

  let total = 0;

  requiredSkills.forEach(skill => {
    const userSkill = progress.completedSkills.find(
      s => s.skill === skill.name
    );

    const currentLevel = userSkill ? userSkill.level : skill.currentLevel;
    total += Math.min(currentLevel, skill.requiredLevel);
  });

  const maxPossible = requiredSkills.length * 100;

  return Math.round((total / maxPossible) * 100);
};

// 🟢 Get Full Progress Dashboard
exports.getProgress = async (req, res) => {
  try {
    const { resumeId } = req.params;

    let progress = await Progress.findOne({ resumeId });

    if (!progress) {
      progress = await Progress.create({ resumeId });
    }

    const readinessScore = await calculateReadiness(resumeId, progress);

    res.json({
      progress,
      readinessScore
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Update Skill Progress
exports.updateSkillProgress = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skill, level } = req.body;

    if (!skill || level === undefined) {
      return res.status(400).json({ error: "Skill and level required" });
    }

    let progress = await Progress.findOne({ resumeId });

    if (!progress) {
      progress = await Progress.create({ resumeId });
    }

    const existingSkill = progress.completedSkills.find(
      s => s.skill === skill
    );

    if (existingSkill) {
      existingSkill.level = level;
    } else {
      progress.completedSkills.push({ skill, level });
    }

    await progress.save();

    const readinessScore = await calculateReadiness(resumeId, progress);

    res.json({
      message: "Skill progress updated",
      progress,
      readinessScore
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Mark Roadmap Week Completed
exports.completeRoadmapWeek = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { week } = req.body;

    if (!week) {
      return res.status(400).json({ error: "Week number required" });
    }

    let progress = await Progress.findOne({ resumeId });

    if (!progress) {
      progress = await Progress.create({ resumeId });
    }

    if (!progress.completedRoadmapWeeks.includes(week)) {
      progress.completedRoadmapWeeks.push(week);
    }

    await progress.save();

    res.json({
      message: "Roadmap week marked as completed",
      progress
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Add Mock Interview Score
exports.addInterviewScore = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: "Score required" });
    }

    let progress = await Progress.findOne({ resumeId });

    if (!progress) {
      progress = await Progress.create({ resumeId });
    }

    progress.interviewScores.push({ score });

    await progress.save();

    const readinessScore = await calculateReadiness(resumeId, progress);

    res.json({
      message: "Interview score added",
      progress,
      readinessScore
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const MarketTrend = require("../models/marketTrend");
const Resume = require("../models/resume");

exports.getMarketInsights = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const trends = await MarketTrend.find();

    const userSkills = resume.skills || [];

    const recommendations = trends.map(trend => {
      const missingSkills = trend.trendingSkills.filter(
        skill => !userSkills.includes(skill)
      );

      return {
        role: trend.role,
        demandScore: trend.demandScore,
        missingSkills,
        recommendationScore: 100 - (missingSkills.length * 10)
      };
    });

    res.json({
      userSkills,
      insights: recommendations
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
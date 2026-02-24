const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  completedSkills: [
    {
      skill: String,
      level: Number   // updated mastery level (0–100)
    }
  ],
  completedRoadmapWeeks: [Number],
  interviewScores: [
    {
      score: Number,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);
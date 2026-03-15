const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filename:         { type: String },
  originalname:     { type: String },
  extractedText:    { type: String },
  skills:           { type: [String], default: [] },
  skillsDetected:   { type: [String], default: [] },
  resumeScore:      { type: Number, default: 0 },
  experienceLevel:  { type: String, default: "Intermediate" },
  projectInsights:  { type: mongoose.Schema.Types.Mixed },
  missingCoreSkills:{ type: [String], default: [] },
  targetRole:       { type: String, default: "Backend Developer" },
  uploadDate:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
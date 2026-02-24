const mongoose = require('mongoose');

const IndustryBenchmarkSchema = new mongoose.Schema({
  role: { type: String, required: true },
  topSkills: [{ name: String, avgLevel: Number }], // skill + average proficiency
  experienceYears: { type: Number, default: 0 }, // average years of experience
  projects: [{ name: String, avgLevel: Number }], // optional: common project skills
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IndustryBenchmark', IndustryBenchmarkSchema);
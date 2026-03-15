require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Resume = require('./src/models/resume');
  const resumes = await Resume.find().sort({ createdAt: -1 }).limit(2).lean();
  
  resumes.forEach((r, i) => {
    console.log(`\n========= Resume ${i+1} =========`);
    console.log('ID:', r._id.toString());
    console.log('skills:', JSON.stringify(r.skills));
    console.log('skillsDetected:', JSON.stringify(r.skillsDetected));
    console.log('resumeScore:', r.resumeScore, '| type:', typeof r.resumeScore);
    console.log('targetRole:', r.targetRole);
    console.log('ALL KEYS:', Object.keys(r).join(', '));
  });

  mongoose.disconnect();
}).catch(e => console.error('DB Error:', e.message));
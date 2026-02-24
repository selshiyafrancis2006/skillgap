const mongoose = require('mongoose');

const SkillGraphSchema = new mongoose.Schema({
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
        unique: true
    },
    targetRole: {
        type: String,
        required: true
    },
    skills: [
        {
            name: String,
            currentLevel: Number,
            requiredLevel: Number,
            gap: Number
        }
    ],
    missingSkills: [String],
    roadmap: [
        {
            week: Number,
            topic: String,
            project: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('SkillGraph', SkillGraphSchema);
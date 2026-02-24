const Resume = require('../models/resume');

// Hardcoded question bank
const questionBank = {
  backend: {
    technical: [
      "Explain event loop in Node.js.",
      "How do you design a REST API?",
      "Describe the difference between SQL and NoSQL databases.",
      "Write a function to reverse a linked list."
    ],
    behavioral: [
      "Tell me about a time you solved a difficult bug.",
      "How do you prioritize tasks in a project?",
      "Describe a challenging teamwork experience."
    ]
  }
};

exports.generateMockInterview = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);

    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const role = resume.targetRole || "backend"; // default to backend
    const roleQuestions = questionBank[role.toLowerCase()];

    if (!roleQuestions) return res.status(400).json({ error: "No questions for this role" });

    const questions = [];

    // pick 3 technical questions randomly
    const techPool = [...roleQuestions.technical];
    while (questions.length < 3 && techPool.length > 0) {
      const i = Math.floor(Math.random() * techPool.length);
      questions.push({ type: "technical", question: techPool[i] });
      techPool.splice(i, 1);
    }

    // pick 2 behavioral questions randomly
    const behPool = [...roleQuestions.behavioral];
    while (questions.filter(q => q.type === "behavioral").length < 2 && behPool.length > 0) {
      const i = Math.floor(Math.random() * behPool.length);
      questions.push({ type: "behavioral", question: behPool[i] });
      behPool.splice(i, 1);
    }

    return res.json({ resumeId, questions });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
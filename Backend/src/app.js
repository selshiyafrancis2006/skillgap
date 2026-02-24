const express = require('express');
const cors = require('cors');

const resumeRoutes = require('./routes/resume.routes');
const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/resume', resumeRoutes);
app.get('/', (req, res) => {
    res.send("SkillGap API Running");
});

module.exports = app;
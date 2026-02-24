require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const resumeRoutes = require('./src/routes/resume.routes');
const chatRoutes = require('./src/routes/chat.routes');
const skillGraphRoutes = require('./src/routes/skillGraph.routes');
const mockInterviewRoutes = require('./src/routes/mockInterview.routes');
const progressRoutes = require('./src/routes/progress.routes');
const marketTrendRoutes = require("./src/routes/marketTrend.routes");
const resumeOptimizerRoutes = require('./src/routes/resumeOptimizer.routes');
const industryBenchmarkRoutes = require('./src/routes/industryBenchmark.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/resume', resumeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/skill-graph', skillGraphRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/progress', progressRoutes);
app.use("/api/market-trend", marketTrendRoutes);
app.use('/api/resume-optimizer', resumeOptimizerRoutes);
app.use('/api/industry-benchmark', industryBenchmarkRoutes);

connectDB();

app.get('/', (req, res) => res.send('Backend is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// src/utils/roadmapGenerator.js

// Map skills to learning paths
const skillLearningMap = {
    "JavaScript": [
        { week: 1, topic: "JavaScript Basics", project: "Build a simple calculator" },
        { week: 2, topic: "DOM Manipulation & Events", project: "Interactive to-do app" },
        { week: 3, topic: "ES6+ Features", project: "Refactor previous projects with modern JS" },
        { week: 4, topic: "Asynchronous JS & APIs", project: "Fetch API data & display dynamically" }
    ],
    "System Design": [
        { week: 1, topic: "System Design Fundamentals", project: "Design a URL shortener" },
        { week: 2, topic: "Database Design", project: "Model a social media database" },
        { week: 3, topic: "High-level Architecture", project: "Design a simple e-commerce system" },
        { week: 4, topic: "Scalability & Caching", project: "Add caching to improve performance" }
    ],
    "React": [
        { week: 1, topic: "React Basics", project: "Counter App" },
        { week: 2, topic: "State & Props", project: "Todo App" },
        { week: 3, topic: "React Router & Forms", project: "Multi-page app" },
        { week: 4, topic: "Advanced React", project: "Integrate API and Context" }
    ],
    "Node.js": [
        { week: 1, topic: "Node.js Basics", project: "Simple API with Express" },
        { week: 2, topic: "REST API", project: "CRUD API with MongoDB" },
        { week: 3, topic: "Authentication & Middleware", project: "Login system" },
        { week: 4, topic: "Deployment", project: "Deploy API to Vercel/AWS" }
    ],
    "MongoDB": [
        { week: 1, topic: "MongoDB Basics", project: "Simple CRUD operations" },
        { week: 2, topic: "Data Modeling", project: "Design schemas for projects" },
        { week: 3, topic: "Indexing & Aggregation", project: "Optimize queries" },
        { week: 4, topic: "Deployment & Atlas", project: "Host DB on MongoDB Atlas" }
    ]
    // Add more skills as needed
};

function generateRoadmap(missingSkills) {
    let roadmap = [];
    let weekCounter = 1;

    missingSkills.forEach(skill => {
        if (skillLearningMap[skill]) {
            skillLearningMap[skill].forEach(step => {
                roadmap.push({
                    week: weekCounter,
                    topic: step.topic,
                    project: step.project
                });
                weekCounter++;
            });
        }
    });

    return roadmap;
}

module.exports = { generateRoadmap };
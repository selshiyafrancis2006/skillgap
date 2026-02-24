// chat.controller.js

const roleGuidance = {
    "Full-Stack Developer": {
        answer: "To become a full-stack developer, focus on:\n- Frontend: HTML, CSS, JavaScript, React.js\n- Backend: Node.js, Express.js, MongoDB\n- Deployment: AWS, Vercel, Netlify\n- Practice building projects end-to-end",
        resources: [
            "Build a CRUD app with Node.js and MongoDB",
            "Create a responsive website using React.js",
            "Deploy a full-stack app on Vercel or AWS"
        ],
        nextSteps: [
            "Learn the missing technologies",
            "Complete at least 2-3 full-stack projects",
            "Practice data structures and algorithms"
        ]
    },
    "Frontend Developer": {
        answer: "To become a Frontend Developer, focus on:\n- HTML, CSS, JavaScript\n- React.js, Next.js, or Vue.js\n- Responsive design and accessibility\n- Build projects with dynamic UI",
        resources: [
            "Create a personal portfolio website",
            "Build a dynamic todo app with React.js",
            "Explore CSS frameworks like Tailwind or Bootstrap"
        ],
        nextSteps: [
            "Master JavaScript ES6+",
            "Build 2-3 interactive projects",
            "Practice responsive and accessible UI design"
        ]
    },
    "Backend Developer": {
        answer: "To become a Backend Developer, focus on:\n- Node.js with Express.js, Django, or Ruby on Rails\n- Database management: MongoDB, PostgreSQL\n- RESTful APIs and authentication\n- Server-side logic and deployment",
        resources: [
            "Build CRUD APIs with Node.js and MongoDB",
            "Create authentication system with JWT",
            "Deploy backend on cloud platforms like AWS"
        ],
        nextSteps: [
            "Learn server-side frameworks",
            "Build 2-3 backend projects",
            "Understand security and scalability"
        ]
    },
    "Data Scientist": {
        answer: "To become a Data Scientist, focus on:\n- Python programming and libraries: NumPy, Pandas, Matplotlib\n- Machine Learning: scikit-learn, TensorFlow, PyTorch\n- Data Analysis & Visualization\n- SQL and databases",
        resources: [
            "Kaggle datasets and competitions",
            "Build ML models on real-world data",
            "Complete Data Science courses on Coursera/EdX"
        ],
        nextSteps: [
            "Learn Python libraries for data manipulation",
            "Complete at least 2 ML projects",
            "Participate in Kaggle competitions"
        ]
    },
    "AI Engineer": {
        answer: "To become an AI Engineer, focus on:\n- Deep Learning frameworks: TensorFlow, PyTorch\n- Model deployment and APIs\n- NLP, Computer Vision, or Reinforcement Learning depending on interest\n- Cloud platforms like AWS or GCP for AI workloads",
        resources: [
            "Build a neural network for image classification",
            "Develop a chatbot using NLP",
            "Deploy AI models on cloud platforms"
        ],
        nextSteps: [
            "Practice DL algorithms",
            "Deploy AI solutions",
            "Stay updated with AI research papers"
        ]
    },
    "Mobile Developer": {
        answer: "To become a Mobile Developer, focus on:\n- Flutter or React Native for cross-platform apps\n- Native development: Kotlin (Android), Swift (iOS)\n- State management, UI/UX best practices",
        resources: [
            "Build a todo app in Flutter or React Native",
            "Publish a small app to Play Store / App Store",
            "Experiment with device features (camera, sensors)"
        ],
        nextSteps: [
            "Learn cross-platform frameworks",
            "Complete at least 2 apps",
            "Understand mobile app lifecycle and performance"
        ]
    },
    "DevOps Engineer": {
        answer: "To become a DevOps Engineer, focus on:\n- CI/CD tools: Jenkins, GitHub Actions\n- Containerization: Docker, Kubernetes\n- Cloud: AWS, Azure, GCP\n- Monitoring & logging: Prometheus, Grafana",
        resources: [
            "Set up CI/CD pipeline for a sample app",
            "Containerize an app using Docker",
            "Deploy using Kubernetes on cloud"
        ],
        nextSteps: [
            "Learn CI/CD principles",
            "Practice cloud deployments",
            "Understand monitoring and scalability"
        ]
    },
    "Cybersecurity Engineer": {
        answer: "To become a Cybersecurity Engineer, focus on:\n- Network security, system hardening\n- Ethical hacking & penetration testing\n- Security tools: Wireshark, Metasploit\n- Learn about encryption, firewalls, and VPNs",
        resources: [
            "Take ethical hacking courses",
            "Set up a lab for penetration testing",
            "Participate in Capture the Flag (CTF) events"
        ],
        nextSteps: [
            "Learn Linux and network fundamentals",
            "Practice on real or virtual labs",
            "Stay updated with latest security threats"
        ]
    },
    "Cloud Engineer": {
        answer: "To become a Cloud Engineer, focus on:\n- Cloud platforms: AWS, Azure, GCP\n- Virtualization, networking, and storage solutions\n- Deployment and automation using Terraform/Ansible",
        resources: [
            "Deploy a web app on AWS or GCP",
            "Learn Infrastructure as Code with Terraform",
            "Set up CI/CD pipelines on cloud"
        ],
        nextSteps: [
            "Gain cloud certifications",
            "Build 2-3 cloud projects",
            "Learn automation and monitoring"
        ]
    },
    "UI/UX Designer": {
        answer: "To become a UI/UX Designer, focus on:\n- Wireframing and prototyping\n- Tools: Figma, Adobe XD, Sketch\n- User research, testing, and accessibility principles",
        resources: [
            "Create a mobile app prototype",
            "Redesign a website for usability",
            "Conduct user testing sessions"
        ],
        nextSteps: [
            "Learn design principles",
            "Build a portfolio of 3-4 projects",
            "Iterate based on user feedback"
        ]
    }
};

// Controller function
exports.getCareerAdvice = (req, res) => {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question is required" });
    }

    const q = question.toLowerCase();

    // Check which role matches
    let answerData = null;
    for (const role in roleGuidance) {
        if (q.includes(role.toLowerCase())) {
            answerData = roleGuidance[role];
            break;
        }
    }

    // Default response if no role matched
    if (!answerData) {
        answerData = {
            answer: "Sorry, I don't have guidance for this role yet. Try Full-Stack Developer, Frontend Developer, Backend Developer, Data Scientist, AI Engineer, Mobile Developer, DevOps Engineer, Cybersecurity Engineer, Cloud Engineer, or UI/UX Designer."
        };
    }

    return res.json(answerData);
};
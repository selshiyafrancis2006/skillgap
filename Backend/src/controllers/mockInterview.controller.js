const Resume = require('../models/resume');

const questionBank = {
  "Full Stack Developer": {
    technical: [
      "Explain the MERN stack architecture and how each component interacts.",
      "How do you connect a React frontend to a Node.js/Express backend?",
      "What is CORS and how do you handle it in Express.js?",
      "How do you manage state in a large-scale React application?",
      "Explain the difference between authentication and authorization. How do you implement JWT?",
      "How would you design a RESTful API for an e-commerce platform?",
      "What is the difference between SQL and NoSQL? When would you choose MongoDB over PostgreSQL?",
      "Explain React's reconciliation algorithm and how the Virtual DOM works.",
      "How do you handle environment variables securely in a full-stack app?",
      "What is middleware in Express.js? Give real-world use cases.",
      "How do you optimize performance in a React app?",
      "Explain how MongoDB indexing works and why it matters.",
    ],
    behavioral: [
      "Describe a full-stack project you built end-to-end. What challenges did you face?",
      "How do you handle a bug that appears on the frontend but originates in the backend?",
      "Tell me about a time you had to learn a new technology quickly for a project.",
      "How do you balance frontend and backend work in a sprint?",
    ]
  },

  "Frontend Developer": {
    technical: [
      "Explain the Virtual DOM in React and how it improves performance.",
      "What is the difference between useEffect and useLayoutEffect?",
      "How does event bubbling and event delegation work in JavaScript?",
      "Explain CSS specificity with examples.",
      "What are React hooks? Explain useState, useEffect, useContext, and useRef.",
      "What is the difference between controlled and uncontrolled components?",
      "How do you implement lazy loading in React?",
      "Explain the difference between flexbox and CSS grid.",
      "What is code splitting and how do you achieve it in React?",
      "How do you handle API errors gracefully in the UI?",
      "What is accessibility (a11y) and how do you ensure your UI is accessible?",
      "Explain the difference between SSR, SSG, and CSR.",
    ],
    behavioral: [
      "Describe a complex UI component you built from scratch.",
      "How do you ensure cross-browser and cross-device compatibility?",
      "Tell me about a time you improved the performance of a web page.",
      "How do you approach responsive design?",
    ]
  },

  "Backend Developer": {
    technical: [
      "Explain the event loop in Node.js and how it handles asynchronous operations.",
      "How do you design a scalable REST API?",
      "What is the difference between SQL and NoSQL databases? When do you use each?",
      "How do you implement authentication using JWT and refresh tokens?",
      "What is database indexing and how does it improve query performance?",
      "Explain the difference between monolithic and microservices architecture.",
      "How do you handle race conditions in a Node.js application?",
      "What are database transactions and when should you use them?",
      "How would you implement rate limiting in an Express API?",
      "Explain the difference between PUT, PATCH, and POST in REST.",
      "How do you secure a Node.js API against common vulnerabilities?",
      "What is Redis and when would you use it as a caching layer?",
    ],
    behavioral: [
      "Tell me about a time you optimized a slow database query.",
      "Describe how you handled a critical bug in production.",
      "How do you approach API versioning when you have existing clients?",
      "Tell me about a time you improved the security of an application.",
    ]
  },

  "Data Scientist": {
    technical: [
      "Explain the bias-variance tradeoff in machine learning.",
      "What is the difference between supervised, unsupervised, and reinforcement learning?",
      "How do you handle missing data in a dataset?",
      "Explain precision, recall, F1-score, and when to use each.",
      "What is cross-validation and why is it important?",
      "How does a Random Forest algorithm work?",
      "Explain gradient descent and its variants (SGD, Adam, RMSProp).",
      "What is feature engineering and why is it important?",
      "How do you detect and handle outliers in a dataset?",
      "What is overfitting and how do you prevent it?",
      "Explain PCA and when you would use dimensionality reduction.",
      "What is the difference between L1 and L2 regularization?",
    ],
    behavioral: [
      "Describe a data science project where your model didn't perform as expected. What did you do?",
      "How do you communicate complex model results to non-technical stakeholders?",
      "Tell me about a time you found a surprising insight in data.",
      "How do you decide which algorithm to use for a given problem?",
    ]
  },

  "AI Engineer": {
    technical: [
      "Explain the transformer architecture and how attention mechanisms work.",
      "What is the difference between fine-tuning and training from scratch?",
      "How do you evaluate an NLP model? What metrics do you use?",
      "Explain the concept of embeddings and how they are used in NLP.",
      "What is transfer learning and why is it powerful?",
      "How would you deploy a machine learning model to production?",
      "What is the difference between CNN and RNN architectures?",
      "How do you handle class imbalance in a deep learning dataset?",
      "Explain RAG (Retrieval Augmented Generation) and its use cases.",
      "What is model quantization and why is it used?",
      "How do you monitor a deployed ML model for drift?",
      "Explain the difference between PyTorch and TensorFlow.",
    ],
    behavioral: [
      "Describe an AI project you built. What was the biggest technical challenge?",
      "How do you stay updated with the rapidly changing AI landscape?",
      "Tell me about a time your model had unexpected behavior in production.",
      "How do you approach ethical concerns in AI development?",
    ]
  },

  "DevOps Engineer": {
    technical: [
      "Explain the CI/CD pipeline and the stages involved.",
      "What is the difference between Docker containers and virtual machines?",
      "How does Kubernetes handle container orchestration?",
      "What is Infrastructure as Code? Explain Terraform.",
      "How do you implement zero-downtime deployments?",
      "Explain the difference between blue-green and canary deployments.",
      "What is a Kubernetes pod, deployment, and service?",
      "How do you monitor application health in production? What tools do you use?",
      "What is the difference between horizontal and vertical scaling?",
      "How do you manage secrets in a Kubernetes environment?",
      "Explain how a load balancer works.",
      "What is a reverse proxy and how does Nginx work?",
    ],
    behavioral: [
      "Describe a production incident you handled. How did you diagnose and fix it?",
      "How do you ensure system reliability and uptime?",
      "Tell me about a time you automated a manual process.",
      "How do you handle a situation where a deployment breaks production?",
    ]
  },

  "Mobile Developer": {
    technical: [
      "Explain the React Native bridge and how it communicates with native modules.",
      "What is the difference between React Native and Flutter?",
      "How do you manage state in a React Native app?",
      "Explain the Android activity lifecycle.",
      "How do you handle offline functionality in a mobile app?",
      "What is the difference between AsyncStorage and SQLite in React Native?",
      "How do you optimize performance in a React Native app?",
      "Explain push notifications and how to implement them.",
      "What are the differences between iOS and Android development?",
      "How do you handle deep linking in a mobile application?",
      "What is Expo and when would you use it over bare React Native?",
      "How do you test mobile applications?",
    ],
    behavioral: [
      "Describe a mobile app you built. What was the most challenging feature?",
      "How do you handle different screen sizes and resolutions?",
      "Tell me about a performance issue you fixed in a mobile app.",
      "How do you approach app store submission and review processes?",
    ]
  },

  "Cloud Engineer": {
    technical: [
      "Explain the difference between IaaS, PaaS, and SaaS.",
      "What is VPC and how do you design a secure network architecture on AWS?",
      "How does auto-scaling work in AWS?",
      "Explain the difference between S3, EBS, and EFS storage options.",
      "What is IAM and how do you implement least privilege access?",
      "How do you design a multi-region highly available architecture?",
      "What is the difference between AWS Lambda and EC2?",
      "Explain how CDN works and when you would use CloudFront.",
      "What is Terraform state and how do you manage it in a team?",
      "How do you reduce cloud costs in a production environment?",
      "What is a managed Kubernetes service (EKS/GKE/AKS)?",
      "How do you implement disaster recovery in the cloud?",
    ],
    behavioral: [
      "Describe a cloud architecture you designed. What tradeoffs did you make?",
      "Tell me about a time you reduced cloud infrastructure costs.",
      "How do you ensure compliance and security in a cloud environment?",
      "Describe how you handled a cloud outage or infrastructure failure.",
    ]
  },

  "Cybersecurity Engineer": {
    technical: [
      "Explain the OWASP Top 10 vulnerabilities.",
      "What is the difference between symmetric and asymmetric encryption?",
      "How does a SQL injection attack work and how do you prevent it?",
      "Explain XSS (Cross-Site Scripting) and CSRF attacks.",
      "What is a penetration test and what are its phases?",
      "How does a man-in-the-middle attack work?",
      "What is a firewall and how does it differ from an IDS/IPS?",
      "Explain public key infrastructure (PKI) and SSL/TLS.",
      "What is the principle of least privilege?",
      "How do you perform a security audit of a web application?",
      "What tools do you use for vulnerability scanning?",
      "Explain how OAuth 2.0 works.",
    ],
    behavioral: [
      "Describe a security vulnerability you discovered and how you handled it.",
      "How do you stay updated with the latest cybersecurity threats?",
      "Tell me about a time you had to convince a team to prioritize security.",
      "How do you approach security in a DevOps pipeline (DevSecOps)?",
    ]
  },

  "UI/UX Designer": {
    technical: [
      "Explain your design process from research to final handoff.",
      "What is the difference between UX and UI design?",
      "How do you conduct user research and usability testing?",
      "Explain design systems and why they are important.",
      "What is the difference between wireframes, mockups, and prototypes?",
      "How do you ensure accessibility in your designs (WCAG guidelines)?",
      "What are micro-interactions and why do they matter?",
      "How do you measure the success of a design?",
      "Explain the principles of Gestalt theory in design.",
      "How do you design for mobile-first?",
      "What tools do you use for design and prototyping?",
      "How do you handle design handoff to developers?",
    ],
    behavioral: [
      "Describe a design project where user feedback changed your direction completely.",
      "How do you handle disagreements with developers about design implementation?",
      "Tell me about a time you simplified a complex user flow.",
      "How do you balance business requirements with user needs?",
    ]
  },
};

// Map any role string to question bank key
const getRoleKey = (role) => {
  if (!role) return "Full Stack Developer";
  const r = role.toLowerCase();
  if (r.includes('full stack') || r.includes('fullstack') || r.includes('mern') || r.includes('full-stack')) return "Full Stack Developer";
  if (r.includes('frontend') || r.includes('front-end') || r.includes('front end')) return "Frontend Developer";
  if (r.includes('backend') || r.includes('back-end') || r.includes('back end')) return "Backend Developer";
  if (r.includes('data scientist') || r.includes('data science') || r.includes('ml engineer')) return "Data Scientist";
  if (r.includes('ai engineer') || r.includes('artificial intelligence') || r.includes('deep learning')) return "AI Engineer";
  if (r.includes('devops') || r.includes('dev ops') || r.includes('site reliability')) return "DevOps Engineer";
  if (r.includes('mobile') || r.includes('android') || r.includes('ios') || r.includes('flutter')) return "Mobile Developer";
  if (r.includes('cloud')) return "Cloud Engineer";
  if (r.includes('cyber') || r.includes('security')) return "Cybersecurity Engineer";
  if (r.includes('ui') || r.includes('ux') || r.includes('designer')) return "UI/UX Designer";
  return "Full Stack Developer";
};

const pickRandom = (arr, count) => {
  const pool = [...arr];
  const result = [];
  while (result.length < count && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    result.push(pool[i]);
    pool.splice(i, 1);
  }
  return result;
};

exports.generateMockInterview = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const roleKey = getRoleKey(resume.targetRole);
    const bank = questionBank[roleKey];

    const questions = [
      ...pickRandom(bank.technical, 3).map(q => ({ type: "technical", question: q })),
      ...pickRandom(bank.behavioral, 2).map(q => ({ type: "behavioral", question: q })),
    ];

    return res.json({
      resumeId,
      targetRole: resume.targetRole || roleKey,
      questions
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
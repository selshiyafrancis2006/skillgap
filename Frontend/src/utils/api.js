const BASE = "http://localhost:5000/api";

const req = async (url, opts = {}) => {
  const res = await fetch(BASE + url, opts);
  return res.json();
};

export const api = {
  uploadResume: (file) => {
    const form = new FormData();
    form.append("resume", file);
    return req("/resume/upload", { method: "POST", body: form });
  },
  optimizeResume: (resumeId, targetRoleSkills) =>
    req("/resume-optimizer/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, targetRoleSkills }),
    }),
  getBenchmark: (resumeId, targetRole) =>
    req(`/industry-benchmark/${resumeId}/${encodeURIComponent(targetRole)}`),
  getSkillGraph: (resumeId) => req(`/skill-graph/${resumeId}`),
  getProgress: (resumeId) => req(`/progress/${resumeId}`),
  updateSkillProgress: (resumeId, skill, level) =>
    req(`/progress/${resumeId}/skill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill, level }),
    }),
  getMockInterview: (resumeId) => req(`/mock-interview/${resumeId}`),
  getMarketInsights: (resumeId) => req(`/market-trend/${resumeId}`),
  getCareerAdvice: (question) =>
    req("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    }),
};
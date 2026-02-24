// Backend/src/utils/resumeAnalysis.js
function detectExperienceLevel(text) {
    if (text.match(/intern|worked on/i)) return "Intermediate";
    if (text.match(/5\+ years|senior/i)) return "Advanced";
    return "Beginner";
}

function assessProjects(text) {
    const projects = [];
    const projectMatches = text.match(/projects?|built using/i);
    if (projectMatches) {
        projects.push("Detected some projects with impact");
    } else {
        projects.push("No significant project info detected");
    }
    return projects;
}

function findMissingCoreSkills(detectedSkills, targetSkills) {
    return targetSkills.filter(skill => !detectedSkills.includes(skill));
}

module.exports = { detectExperienceLevel, assessProjects, findMissingCoreSkills };